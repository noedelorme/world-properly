function random_permutation(n) {
    let permutation = Array.from({ length: n-1 }, (_, i) => i + 1);
    permutation.sort(() => Math.random() - 0.5);

    return permutation;
}

function levenshtein_distance(s, t){
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
    country_name.innerHTML = country.name;
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

function new_answer_element(country, color="green", capital=false){
    let answer = document.createElement("div");
    answer.classList.add("answer", color);
    let img_container = document.createElement("div");
    img_container.classList.add("img-container");
    let img = document.createElement("img");
    img.src = country.flag;
    let text = document.createElement("span");
    if(!capital){
        text.innerHTML = country.name;
    }else if(capital){
        text.innerHTML = country.capital;
    }
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
        // let item = world.continents[i].countries[j];
        // item.game = {
        //     "countries": {
        //         "finds": 0,
        //         "element": null
        //     },
        //     "capitals": {
        //         "finds": 0,
        //         "element": null
        //     },
        //     "flags": {
        //         "finds": 0,
        //         "element": null
        //     },
        //     "population": {
        //         "finds": 0,
        //         "element": null
        //     }
        // }
        // countries.push(item)
        let country = world.continents[i].countries[j];
        country.game = {};
        countries.push(country)
    }
}


( () => { /*** List of the countries  *******************************/

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


( () => { /*** First game: Countries  *******************************/

let input = document.getElementById("countries-input");
let enter = document.getElementById("countries-enter");
let hint = document.getElementById("countries-hint");
let answers = document.getElementById("countries-answers");
let counter = document.getElementById("countries-counter");
let cnt = 0;
let current_hint;
let hint_cnt = 0;
let perm = random_permutation(countries.length);

for (let i = 0; i < countries.length; i++) {
    countries[i].game.countries = {
        "found": false,
        "element": null
    };
}

populate_answers(answers, 30);

const fuse = new Fuse(countries, {
    includeScore: true,
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
        if(is_long_enough(value, better.name)){
            if(!better.game.countries.found && true){ // true = si on a pas utilisé d'indices
                better.game.countries.found = true;
                let color = hint_cnt==0 ? "green" : "orange";
                better.game.countries.element = new_answer_element(better, color=color);
                answers.insertBefore(better.game.countries.element, answers.firstChild);
                input.value = "";
                cnt++;
                counter.innerHTML = cnt + "/197";
                hint_cnt = 0;
                current_hint = null;
            }
        }
    }
}

function hint_event(){
    if (hint_cnt>0){ // if we already have an hint
        if (hint_cnt<current_hint.length){
            input.value = current_hint.substring(0, hint_cnt+1);
            hint_cnt++;
        }
    }else{ // else we chose another hint
        for (let i = 0; i < countries.length; i++) {
            let country = countries[perm[i]];
            if (!country.game.countries.found) {
                current_hint = country.name;
                input.value = current_hint[0];
                hint_cnt++;
                break;
            }
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


} )();






/*************************************
 *   Game options                    *
 *************************************/
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