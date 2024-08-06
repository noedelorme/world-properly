function random_permutation(n) {
    let permutation = Array.from({ length: n }, (_, i) => i);
    permutation.sort(() => Math.random() - 0.5);

    return permutation;
}

let countries = [];
for(let i=0; i<world.continents.length; i++){
    for(let j=0; j<world.continents[i].countries.length; j++){
        let country = world.continents[i].countries[j];
        country.game = {};
        countries.push(country)
    }
}




class Game {
    constructor(game_id) {
        // setup html elements
        this.game = document.querySelector("#"+game_id);
        this.hint = document.querySelector("#"+game_id+" .hint");
        this.abandon = document.querySelector("#"+game_id+" .abandon");
        this.input = document.querySelector("#"+game_id+" .input");
        this.enter = document.querySelector("#"+game_id+" .enter");
        this.counter = document.querySelector("#"+game_id+" .counter");
        

        // setup attributes
        this.cnt = [0,0,0];
        this.current_clue;
        this.hint_cnt = 0;
        this.perm = random_permutation(countries.length);

        // setup game-specific data
        for (let i = 0; i < countries.length; i++) {
            countries[i].game[game_id] = {
                "found": false,
                "element": null
            };
        }
    }

    hint_event() {
        return true;
    }

    abandon_event() {
        return true;
    }
    
    play_event() {
        return true;
    }
}

class ClueGame extends Game {
    constructor(game_id) {
        super(game_id);
        this.clue = document.querySelector("#"+game_id+" .clue");
    }

    fill_clue() {
        return true;
    }
}


let game = new Game("countries");