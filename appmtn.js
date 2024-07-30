

/*************************************
 *   Second game: Capitals           *
 *************************************/

let capitals_input = document.getElementById("capitals-input");
let capitals_answers = document.getElementById("capitals-answers");
let capitals_counter = document.getElementById("capitals-counter");
let capitals_clue = document.getElementById("capitals-clue");
let capitals_cnt = 0;
let capitals_try = 0;

const capitals_clues = countries; // générer un ordre aléatoire

function fill_capitals_clue(){
    let current_clue = capitals_clues[capitals_cnt%197];
    capitals_clue.innerHTML = "<img src=\"" + current_clue.flag + "\"> " + current_clue.name;
}

function is_valid_capital_guess(guess){ // one of the capitals + approximation égale + no case sensitive
    let current_clue = capitals_clues[capitals_cnt%197];
    // let current_capitals = current_clue.capital.split(", ");
    return guess == current_clue.capital;
}

fill_capitals_clue();

capitals_input.addEventListener("keydown", function(e){
    if(e.key === 'Enter'){
        capitals_try++;
        let current_clue = capitals_clues[capitals_cnt%197];
        if(is_valid_capital_guess(this.value)){ 
            current_clue.game.capitals.finds++;
            current_clue.game.capitals.element = new_answer_element(current_clue, capital=true);
            if(capitals_try>1){
                current_clue.game.capitals.element.classList.remove("green");
                current_clue.game.capitals.element.classList.add("orange");
            }
            capitals_answers.appendChild(current_clue.game.capitals.element);
            this.value = "";
            capitals_cnt++;
            capitals_counter.innerHTML = capitals_cnt + "/197";
            fill_capitals_clue();
            capitals_try = 0;
        }
    }
});

// for (let index = 0; index < countries.length; index++) {
//     const element = countries[index];
//     capitals_answers.appendChild(new_answer_element(element, capital=true));
// }




/*************************************
 *   Third game: Flags               *
 *************************************/





/*************************************
 *   Fourth game: Population         *
 *************************************/

let population_input = document.getElementById("population-input");
let population_value = document.getElementById("population-value");


population_input.addEventListener("input", function(e){
    let scaled_value = 1500*(this.value/100)**3;
    scaled_value = scaled_value<1 ? scaled_value.toFixed(2) : scaled_value.toFixed(0);
    population_value.innerHTML = scaled_value + " M";
});




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