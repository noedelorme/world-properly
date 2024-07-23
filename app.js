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

function new_answer_element(country, capital=false){
    let answer = document.createElement("div");
    answer.classList.add("answer", "green");
    let img_container = document.createElement("div");
    img_container.classList.add("img-container");
    let img = document.createElement("img");
    img.src = country.flag;
    let text = document.createElement("span");
    text.innerHTML = country.name;

    img_container.appendChild(img);
    answer.append(img_container);
    answer.appendChild(text)

    return answer;
}

let countries = [];
for(let i=0; i<world.continents.length; i++){
    for(let j=0; j<world.continents[i].countries.length; j++){
        let item = world.continents[i].countries[j];
        item.game = {
            "countries": false,
            "capitals": false,
            "flags": false
        }
        countries.push(item)
    }
}


/*************************************
 *   List of the countries           *
 *************************************/
let list = document.getElementById("list");
for (let i = 0; i < world.continents.length; i++) {
    const continent = world.continents[i];
    let continent_element = new_continent_element(continent)
    list.appendChild(continent_element);

    for (let j = 0; j < world.continents[i].countries.length; j++) {
        const country = world.continents[i].countries[j];
        continent_element.appendChild(new_country_element(country));
    }
}


/*************************************
 *   First game: Countries           *
 *************************************/

let countries_input = document.getElementById("countries-input");
let countries_list = document.getElementById("countries-list");
let countries_counter_element = document.getElementById("countries-counter");
let countries_counter = 0;

countries_input.addEventListener("keydown", function(e){
    if(e.key === 'Enter'){
        console.log(this.value);
        const options = {
            includeScore: true,
            threshold: 0.6,
            keys: ['name']
        };
        const fuse = new Fuse(countries, options);
        let results = fuse.search(this.value);

        if(results.length>0){
            // add better conditions for treshold
            let better = results[0].item;
            if(!better.game.countries){
                countries_counter++;
                countries_counter_element.innerHTML = countries_counter + "/197";
                better.game.countries = true;
                countries_list.appendChild(new_answer_element(results[0].item));
                this.value = "";
            }
        }
    }
});




/*************************************
 *   Second game: Capitals           *
 *************************************/







/*************************************
 *   Third game: Falgs               *
 *************************************/






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