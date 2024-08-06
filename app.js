function random_permutation(n) {
    let permutation = Array.from({ length: n }, (_, i) => i);
    permutation.sort(() => Math.random() - 0.5);

    return permutation;
}

function levenshtein_distance(s, t){
    s = s.toLowerCase().replace(/[^a-zA-Z ]/g, "");
    t = t.toLowerCase().replace(/[^a-zA-Z ]/g, "");
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] = i===0 ? j : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
        }
    }
    return arr[t.length][s.length];
}

function new_continent_element(continent){
    let continent_element = document.createElement("div");
    continent_element.classList.add("continent");
    let continent_name = document.createElement("div");
    continent_name.classList.add("continent-name");
    continent_name.innerHTML = continent.name;
    let continent_population = document.createElement("div");
    continent_population.classList.add("continent-population");
    continent_population.innerHTML = continent.population;

    continent_name.appendChild(continent_population);
    continent_element.appendChild(continent_name);

    return continent_element;
}

function new_country_element(country){
    let country_element = document.createElement("div");
    country_element.classList.add("country");
    let country_content = document.createElement("div");
    country_content.classList.add("country-content", "clearfix");
    let country_flag = document.createElement("div");
    country_flag.classList.add("country-flag");
    let img = document.createElement("img");
    img.src = country.flag;
    let country_info = document.createElement("div");
    country_info.classList.add("country-info");
    let country_name = document.createElement("span");
    country_name.classList.add("country-name");
    country_name.innerHTML = country.name[0];
    let country_capital = document.createElement("span");
    country_capital.classList.add("country-capital");
    country_capital.innerHTML = country.capital;
    let country_population = document.createElement("span");
    country_population.classList.add("country-population");
    country_population.innerHTML = country.population;
    
    country_info.appendChild(country_name);
    country_info.appendChild(country_capital);
    country_flag.appendChild(img);
    country_content.appendChild(country_flag);
    country_content.appendChild(country_info);
    country_content.appendChild(country_population);
    country_element.appendChild(country_content);

    country_element.addEventListener("click", function(e){
        this.classList.toggle("selected");
    });

    return country_element;
}

function new_answer_element(country, color="green", capital=-1, population=false){
    let answer = document.createElement("div");
    answer.classList.add("answer", color);
    let img_container = document.createElement("div");
    img_container.classList.add("img-container");
    let img = document.createElement("img");
    img.src = country.flag;
    let text = document.createElement("span");
    if (capital == -1) text.innerHTML = country.name[0];
    if (capital != -1) text.innerHTML = country.capital[capital];
    if (population) text.innerHTML += " (" + country.population + " M)";
    img_container.appendChild(img);
    answer.append(img_container);
    answer.appendChild(text)

    return answer;
}

function populate_answers(answers, n){
    let perm = random_permutation(countries.length);

    for (let i = 0; i < n; i++) {
        const element = countries[perm[i]];
        answers.appendChild(new_answer_element(element));
    }
}

let countries = [];
for(let i=0; i<world.continents.length; i++){
    for(let j=0; j<world.continents[i].countries.length; j++){
        let country = world.continents[i].countries[j];
        country.game = {};
        countries.push(country)
    }
}


( () => { /*** List of the countries  ****************************************************************/

let list = document.getElementById("list");
for (let i = 0; i < world.continents.length; i++) {
    let continent = world.continents[i];
    let continent_element = new_continent_element(continent)
    list.appendChild(continent_element);

    for (let j = 0; j < continent.countries.length; j++) {
        let country =continent.countries[j];
        let coutry_element = new_country_element(country);
        continent_element.appendChild(coutry_element);
    }
}

} )();


( () => { /*** First game: Countries  ****************************************************************/

let input = document.getElementById("countries-input");
let enter = document.getElementById("countries-enter");
let hint = document.getElementById("countries-hint");
let abandon = document.getElementById("countries-abandon");
let answers = document.getElementById("countries-answers");
let counter = document.getElementById("countries-counter");
let cnt = [0,0,0];
let current_hint;
let hint_cnt = 0;
let perm = random_permutation(countries.length);

for (let i = 0; i < countries.length; i++) {
    countries[i].game.countries = {
        "found": false,
        "element": null
    };
}

const fuse = new Fuse(countries, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    keys: ['name']
});

function is_long_enough(guess, answer){
    let length_treshold = 0.2;
    return (1-length_treshold)*answer.length <= guess.length && guess.length <= (1+length_treshold)*answer.length;
}

function play_event(value){
    let results = fuse.search(value);
    if(results.length>0){
        let better = results[0].item;
        let match = results[0].matches[0].value;
        if(is_long_enough(value, match)){
            if(!better.game.countries.found){
                better.game.countries.found = true;
                let color;
                if (hint_cnt == 0) { color = "green"; }
                else if (hint_cnt <= 3) { color = "orange"; }
                else { color = "red"; }
                better.game.countries.element = new_answer_element(better, color=color);
                answers.insertBefore(better.game.countries.element, answers.firstChild);
                input.value = "";
                if (hint_cnt == 0) cnt[0]++;
                else if (hint_cnt <= 3) cnt[1]++;
                else cnt[2]++;
                counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
                hint_cnt = 0;
                current_hint = null;
            }
        }
    }
}

function hint_event(){
    if (hint_cnt==0){
        for (let i = 0; i < countries.length; i++) {
            let country = countries[perm[i]];
            if (!country.game.countries.found) {
                current_hint = country.name[0];
                break;
            }
        }
    }
    input.value = current_hint.substring(0, hint_cnt+1);
    hint_cnt++;
    input.focus();
}

function abandon_event () {
    for (let i = 0; i < countries.length; i++) {
        let country = countries[perm[i]];
        if (!country.game.countries.found) {
            country.game.countries.found = true;
            country.game.countries.element = new_answer_element(country, color="red");
            answers.insertBefore(country.game.countries.element, answers.firstChild);
            hint_cnt = 0;
            cnt[2]++;
            counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
            break;
        }
    }
}

input.addEventListener("keydown", function(e){
    if(e.key === 'Enter'){
        play_event(this.value);
    }
});

enter.addEventListener("click", function(e){
    play_event(input.value);
});

hint.addEventListener("click", function(e){
    hint_event();
});

abandon.addEventListener("click", function(e){
    abandon_event();
});


} )();



( () => { /*** Second game: Capitals  ****************************************************************/

let input = document.getElementById("capitals-input");
let enter = document.getElementById("capitals-enter");
let hint = document.getElementById("capitals-hint");
let abandon = document.getElementById("capitals-abandon");
let answers = document.getElementById("capitals-answers");
let counter = document.getElementById("capitals-counter");
let clue = document.getElementById("capitals-clue");
let cnt = [0,0,0];
let current_clue;
let hint_cnt = 0;
let perm = random_permutation(countries.length);

for (let i = 0; i < countries.length; i++) {
    countries[i].game.capitals = {
        "found": false,
        "element": null
    };
}

function fill_clue(){
    current_clue = null;
    for (let i = 0; i < countries.length; i++) {
        let country = countries[perm[i]];
        if (!country.game.capitals.found) {
            current_clue = country;
            break;
        }
    }
    if (current_clue != null) {
        clue.innerHTML = "<img src=\"" + current_clue.flag + "\"> " + current_clue.name[0];
    }
}

function play_event (value) {
    for (let i = 0; i < current_clue.capital.length; i++) {
        let capital = current_clue.capital[i];
        if (levenshtein_distance(capital, value) <=3) {
            current_clue.game.capitals.found = true;
            let color;
            if (hint_cnt == 0) { color = "green"; }
            else if (hint_cnt <= 3) { color = "orange"; }
            else { color = "red"; }
            current_clue.game.capitals.element = new_answer_element(current_clue, color=color, capital=i);
            answers.insertBefore(current_clue.game.capitals.element, answers.firstChild);
            input.value = "";
            if (hint_cnt == 0) cnt[0]++;
            else if (hint_cnt <= 3) cnt[1]++;
            else cnt[2]++;
            counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
            fill_clue();
            hint_cnt = 0;

            break;
        }
    }
    
}

function hint_event () {
    let hint = current_clue.capital[0];
    input.value = hint.substring(0, hint_cnt+1);
    hint_cnt++;
    input.focus();
}

function abandon_event () {
    current_clue.game.capitals.found = true;
    current_clue.game.capitals.element = new_answer_element(current_clue, color="red", capital=0);
    answers.insertBefore(current_clue.game.capitals.element, answers.firstChild);
    input.value = "";
    fill_clue();
    hint_cnt = 0;
    cnt[2]++;
    counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
}

fill_clue();

input.addEventListener("keydown", function(e){
    if(e.key === 'Enter'){
        if (current_clue != null) {
            play_event(this.value);
        }
    }
});

enter.addEventListener("click", function(e){
    if (current_clue != null) {
        play_event(input.value);
    }
});

hint.addEventListener("click", function(e){
    if (current_clue != null) {
        hint_event();
    }
});

abandon.addEventListener("click", function(e){
    if (current_clue != null) {
        abandon_event();
    }
});

} )();




( () => { /*** Thrid game: Flags  ****************************************************************/

let input = document.getElementById("flags-input");
let enter = document.getElementById("flags-enter");
let hint = document.getElementById("flags-hint");
let abandon = document.getElementById("flags-abandon");
let answers = document.getElementById("flags-answers");
let counter = document.getElementById("flags-counter");
let clue = document.getElementById("flags-clue");
let cnt = [0,0,0];
let current_clue;
let hint_cnt = 0;
let perm = random_permutation(countries.length);

for (let i = 0; i < countries.length; i++) {
    countries[i].game.flags = {
        "found": false,
        "element": null
    };
}

function fill_clue(){
    current_clue = null;
    for (let i = 0; i < countries.length; i++) {
        let country = countries[perm[i]];
        if (!country.game.flags.found) {
            current_clue = country;
            break;
        }
    }
    if (current_clue != null) {
        clue.innerHTML = "<img src=\"" + current_clue.flag + "\">";
    }
}

function play_event (value) {
    for (let i = 0; i < current_clue.name.length; i++) {
        let name = current_clue.name[i];
        if (levenshtein_distance(name, value) <=3) {
            current_clue.game.flags.found = true;
            let color;
            if (hint_cnt == 0) { color = "green"; }
            else if (hint_cnt <= 3) { color = "orange"; }
            else { color = "red"; }
            current_clue.game.flags.element = new_answer_element(current_clue, color=color);
            answers.insertBefore(current_clue.game.flags.element, answers.firstChild);
            input.value = "";
            if (hint_cnt == 0) cnt[0]++;
            else if (hint_cnt <= 3) cnt[1]++;
            else cnt[2]++;
            counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
            fill_clue();
            hint_cnt = 0;

            break;
        }
    }
    
}

function hint_event () {
    let hint = current_clue.name[0];
    input.value = hint.substring(0, hint_cnt+1);
    hint_cnt++;
    input.focus();
}

function abandon_event () {
    current_clue.game.flags.found = true;
    current_clue.game.flags.element = new_answer_element(current_clue, color="red");
    answers.insertBefore(current_clue.game.flags.element, answers.firstChild);
    input.value = "";
    fill_clue();
    hint_cnt = 0;
    cnt[2]++;
    counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
}

fill_clue();

input.addEventListener("keydown", function(e){
    if(e.key === 'Enter'){
        if (current_clue != null) {
            play_event(this.value);
        }
    }
});

enter.addEventListener("click", function(e){
    if (current_clue != null) {
        play_event(input.value);
    }
});

hint.addEventListener("click", function(e){
    if (current_clue != null) {
        hint_event();
    }
});

abandon.addEventListener("click", function(e){
    if (current_clue != null) {
        abandon_event();
    }
});

} )();






( () => { /*** Fourth game: Population  ****************************************************************/

let input = document.getElementById("population-input");
let enter = document.getElementById("population-enter");
let answers = document.getElementById("population-answers");
let counter = document.getElementById("population-counter");
let clue = document.getElementById("population-clue");
let value = document.getElementById("population-value");
let cnt = [0,0,0];
let current_clue;
let hint_cnt = 0;
let perm = random_permutation(countries.length);

for (let i = 0; i < countries.length; i++) {
    countries[i].game.population = {
        "found": false,
        "element": null
    };
}

function real_value(value){
    return 1500*(value/100)**3;
}

function is_good_guess (clue, guess) {
    if (0.8*clue <= guess && guess <= 1.2*clue) {
        return "green";
    } else if (0.65*clue <= guess && guess <= 1.35*clue) {
        return "orange";
    } else {
        return "red";
    }
}

function fill_clue(){
    current_clue = null;
    for (let i = 0; i < countries.length; i++) {
        let country = countries[perm[i]];
        if (!country.game.population.found) {
            current_clue = country;
            break;
        }
    }
    if (current_clue != null) {
        clue.innerHTML = "<img src=\"" + current_clue.flag + "\"> " + current_clue.name[0];
    }
}

function play_event (value) {
    current_clue.game.population.found = true;
    let color = is_good_guess(value, current_clue.population);
        
    current_clue.game.population.element = new_answer_element(current_clue, color=color, capital=-1, population=true);
    answers.insertBefore(current_clue.game.population.element, answers.firstChild);
    if (color == "green") cnt[0]++;
    else if (color == "orange") cnt[1]++;
    else cnt[2]++;
    counter.innerHTML = "<span class=\"font-green\">" + cnt[0] + "</span>/<span class=\"font-orange\">" + cnt[1] + "</span>/<span class=\"font-red\">" + cnt[2] + "</span>" + " (" + (cnt[0]+cnt[1]+cnt[2]) + "/197)";
    fill_clue();
}

fill_clue();

input.addEventListener("input", function(e){
    let scaled_value = real_value(this.value);
    scaled_value = scaled_value<1 ? scaled_value.toFixed(2) : scaled_value.toFixed(0);
    value.innerHTML = scaled_value + " M";
});

enter.addEventListener("click", function(e){
    if (current_clue != null) {
        play_event(real_value(input.value));
    }
});

} )();



( () => { /*** Game options ****************************************************************/

let countries_section = document.getElementById("countries");
let capitals_section = document.getElementById("capitals");
let flags_section = document.getElementById("flags");
let population_section = document.getElementById("population");

let option_select = document.getElementById("game-option");
option_select.addEventListener("change", function(e){
    list.classList.remove("selected");
    countries_section.classList.remove("selected");
    capitals_section.classList.remove("selected");
    flags_section.classList.remove("selected");
    population_section.classList.remove("selected");

    if(this.value == "list"){
        list.classList.add("selected")
    }else if(this.value == "countries"){
        countries_section.classList.add("selected")
    }else if(this.value == "capitals"){
        capitals_section.classList.add("selected")
    }else if(this.value == "flags"){
        flags_section.classList.add("selected")
    }
    else if(this.value == "population"){
        population_section.classList.add("selected")
    }
    
});

let mtn = document.getElementById("share");
share.addEventListener("click", function(e){
    this.classList.add("clicked");
    setTimeout(function() {
        share.classList.remove("clicked");
    }, 100);
    navigator.clipboard.writeText("https://noedelor.me/world");
});

} )();