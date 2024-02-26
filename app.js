
class Player {
    constructor () {
        this.name;
        this.scores = 0;
        this.maxScores = 17;
    }

}

class ShipBoard {
    table;

    constructor(id, name) {
        this.player = new Player();
        this.player.name = name;
        this.bordId = id;
        this.table = this.drawBord();
        const bordEl = document.getElementById(id);
        bordEl.append(this.table);
        this.createShips(); 
    }
    
    //creates bord based on the table elements
     drawBord() {
        const body = document.getElementsByTagName('body');
        const table = document.createElement('table');
        let decimalValue = 64;
        let counter = 0;
        for(let i = 0; i < 11; i++) {
            const row = document.createElement('tr');
            table.appendChild(row);
                
                for (var j = 0; j < 11; j++) {
                    const tdElement = document.createElement('td');
                    if(i > 0 && j > 0) {
                        counter++;
                        tdElement.setAttribute('data-info', '');
                        tdElement.id = counter + "-" + this.bordId;
                        tdElement.addEventListener('click', event => {
                            this.shootHandler(event.target.id) ;
                         });
                    };

                    if(i === 0 && j > 0) tdElement.innerHTML = String.fromCharCode(decimalValue);
                    if(i > 0 && j === 0) tdElement.innerHTML = i;
                    row.appendChild(tdElement);
                    decimalValue++;
                }
        }
         
        return table;
    }

    randomInt() {
        let randomNumber = Math.floor(Math.random()*10);
        return randomNumber + 1;
    }

    static counter = 0;


    setShip(mastNumb) {
        //disable ships view mode
        let shipViewMode = false;
        let x = this.randomInt(); 
        let y = this.randomInt(); 
        let direction = this.randomInt(); 
        let row = this.table.rows[x];
        let startPoint;
        
        //sets ships and direction based on the random coordinates
        if(direction <= 5) {
            //checks if overpass borders
            while(y + mastNumb > 11) y--;
            startPoint = y;
            for(let i = 0; i < mastNumb; i++) {
                if(row.cells[y++].dataset.info != '') return false;
            }
            //sets ship on bord
            y = startPoint;
            for(let i = 0; i < mastNumb; i++) {
                 this.counter++;
                 row.cells[y++].dataset.info = 'true'; 
                 if(shipViewMode) row.cells[y-1].innerHTML = 'O'; 
            }

        }
        //sets ships and direction based on the random coordinates
        if(direction > 5) {
            //checks if overpass borders
            while(x + mastNumb > 11) x--;
            startPoint = x;
            for(let i = 0; i < mastNumb; i++) {
                row = this.table.rows[x++];
                if(row.cells[y].dataset.info != '') return false;
            }
            //sets ship on bord
            x = startPoint;
            for(let i = 0; i < mastNumb; i++) {
                this.counter++;
                row = this.table.rows[x++];
                row.cells[y].dataset.info = 'true';
                if(shipViewMode) row.cells[y].innerHTML = 'X';
            }
        }
        return true;
    }

    //creates all ships
    createShips() {
        while(!this.setShip(5));
        while(!this.setShip(4));
        while(!this.setShip(3));
        while(!this.setShip(3));
        while(!this.setShip(2));
    }

    switchHandlerFunction(switchhandlerFunction){
        this.switchHandler = switchhandlerFunction;
    }

    changePlayer() {
        this.hasActiveRound = true;
    }

    hasActiveRound = true;


    shootHandler(elementId) {
        if(this.hasActiveRound) {
            const targetElement = document.getElementById(elementId);
            const info = targetElement.dataset.info;
            //checks if field is empty
            if(info === '') {
                targetElement.innerHTML = 'X';
                targetElement.dataset.info = 'false';
                this.hasActiveRound = false;
                this.switchHandler();
            }
            //check if field has a ship
            if(info === 'true') {
             targetElement.style.backgroundColor = "lightblue";
             targetElement.dataset.info = 'false';
             this.hasActiveRound = false;
             this.switchHandler();
             //check palyer and draw scores
             if(this.player.name === 'player1') {
                    this.player.scores += 1;
                    const scoresEl = document.getElementById('player1').getElementsByTagName('p');
                    scoresEl[1].innerHTML = 'SCORES: ' + this.player.scores + ' pts';
                    if(this.player.scores === 17) {
                        window.alert(`${this.player.name}` + " wins!");
                        location.reload();
                    }
                }else {
                    this.player.scores += 1;
                    const scoresEl = document.getElementById('player2').getElementsByTagName('p');
                    scoresEl[1].innerHTML = 'SCORES: ' + this.player.scores + ' pts';
                    if(this.player.scores === 17) {
                        window.alert(`${this.player.name}` + " wins!");
                        location.reload();
                    }
                }
            }
        }
    }
}

class App {
    static init() {
        const bord1 = new ShipBoard('bord1', 'player1');
        const bord2 = new ShipBoard('bord2', 'player2');
        bord1.switchHandlerFunction(bord2.changePlayer.bind(bord2));
        bord2.switchHandlerFunction(bord1.changePlayer.bind(bord1));
    }
}

App.init();