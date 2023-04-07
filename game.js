window.addEventListener('load',()=>{
    intro()
    get_question();
})

let STAGE = 0;
let STAGE_checker;
let PLAYER_LIVES = 7;
let QUESTION;
let ANSWER;
let ANSWER_LIST = [];
let CATEGORY;
let NEXT_CATEGORY;

let NEXT_QUESTION;
let NEXT_ANSWER;

let WIN_PROGRESS = 0;
let WIN_CRITERIA = 0;
let SCORE = 0;
let HIGH_SCORE = 0;

let SNOW_FALLING;

const ALPHA_1 = ['Q','W','E','R','T','Y','U','I','O','P']
const ALPHA_2 = ['A','S','D','F','G','H','J','K','L']
const ALPHA_3 = ['Z','X','C','V','B','N','M']
const ALPHA_4 = ['1','2','3','4','5','6','7','8','9','0']

function intro() {
    const game_space = document.querySelector('#game_space')

    const load_title = document.createElement('div')
    load_title.setAttribute('id', 'load_title')
    load_title.innerText = 'HANG MAN';

    game_space.appendChild(load_title)

    const high_score_tab = document.getElementById("high_score")
    high_score_tab.innerText = `HIGH SCORE: ${HIGH_SCORE}`
}

async function get_question(){
    const apiEndpoint = 'https://api.api-ninjas.com/v1/trivia?limit=1'

    try {
        const response = await fetch(apiEndpoint, {
            headers: {
                "X-Api-Key":"yUVOkjmkB/f7OahD06o40g==TlS7PnY3JsviGM4r"
            }
        });
        const data = await response.json();
        console.log(data[0].answer)

        if (!QUESTION){
            QUESTION = data[0].question;
            ANSWER = data[0].answer;
            CATEGORY = data[0].category

            start_button()

        } else {
            return data
        }
    } catch(error) {
        console.log('Error', error);
    }
}



//load the introduction and start button
function start_button() {
    const load_title = document.getElementById('load_title')

    const startButton = document.createElement('button')
    startButton.setAttribute('id', 'startButton')
    startButton.innerText = 'Press Here to Start!';

    load_title.appendChild(startButton)

    one_click_destroy('#load_title');
    start_checking();
    const high_score_tab = document.getElementById("high_score")
    high_score_tab.innerText = `HIGH SCORE: ${HIGH_SCORE}`
}

function start_checking() {
    if (!STAGE_checker)    {
        STAGE_checker = setInterval(check_stage,500);
    }

    if (localStorage.getItem('High Score')){
        HIGH_SCORE = localStorage.getItem('High Score')
    } else {
        localStorage.setItem('High Score', 0)
    }
}

function stop_checking() {
    if (STAGE_checker)
    {
        clearInterval(STAGE_checker);
        STAGE_checker = null;
    }
    build_keyboard();
}

function check_stage(){
    if (STAGE == 1)
    {
        build_space()
    }
}

function build_space() {
    const g_space = document.getElementById('game_space')
    const p_space = document.getElementById('hang_space')

    const hangSpace = document.createElement('div')
    hangSpace.setAttribute('id', 'hangSpace')
    p_space.appendChild(hangSpace)

    const moodSpace = document.createElement('div')
    moodSpace.setAttribute('id', 'moodSpace')
    p_space.appendChild(moodSpace)

    const wordSpace = document.createElement('div')
    wordSpace.setAttribute('id', 'wordSpace')
    g_space.appendChild(wordSpace)

    const questionSpace = document.createElement('div')
    questionSpace.setAttribute('id', 'questionSpace')
    wordSpace.appendChild(questionSpace)

    const answerSpace = document.createElement('div')
    answerSpace.setAttribute('id', 'answerSpace')
    wordSpace.appendChild(answerSpace)

    STAGE += 1;
    stop_checking()

    setTimeout(() => {
        build_question()
        build_try_answer();
    }, 500)

}



function hangMan_countdown(){
    const hangman_target = document.getElementById('hangSpace')

    setTimeout(() => {
        hangman_target.style.backgroundImage = `url("assets/base${PLAYER_LIVES}.png")`
        hangman_target.style.backgroundSize = "70%"
        hangman_target.style.backgroundPosition = "center"
        hangman_target.style.backgroundRepeat = "no-repeat"
        if (PLAYER_LIVES == 1){
            game_over()
        }
    },1000)
}


async function prepare_next_question(){
    const trivia_data = await get_question();

    try {
        NEXT_QUESTION = trivia_data[0].question;
        NEXT_ANSWER = trivia_data[0].answer;
        NEXT_CATEGORY = trivia_data[0].category;
    } catch(error){
        if (!trivia_data){
            setTimeout(() => {
                NEXT_QUESTION = trivia_data[0].question;
                NEXT_ANSWER = trivia_data[0].answer;
                NEXT_CATEGORY = trivia_data[0].category;
            }, 500);
        }
    }
}

function build_question(){
    const qSpace = document.getElementById('questionSpace')
    qSpace.innerText = '';
    qSpace.innerText = QUESTION;

    const level_tab = document.getElementById("level")
    level_tab.innerText = '';
    if (CATEGORY){
        if (CATEGORY == 'artliterature'){
            level_tab.innerText = `CATEGORY: ART AND LITERATURE`;
        } else if (CATEGORY == 'sciencenature'){
            level_tab.innerText = `CATEGORY: SCIENCE AND NATURE`;
        } else {
            level_tab.innerText = `CATEGORY: ${CATEGORY}`;
        }
    } else {
        level_tab.innerText = 'CATEGORY: RANDOM';
    }


    hangMan_countdown()
    prepare_next_question()
}

function build_try_answer(){

    let answer_array = ANSWER.split('')
    answer_array.map((elem) => {
        ANSWER_LIST.push(elem.toUpperCase())
    })

    for (i=0;i<ANSWER.length;i++){
        if (ANSWER_LIST[i] == " "){
            create_space(i)
        } else {
            build_line(i,'_')
            WIN_CRITERIA += 1;
        }
    }
}

function build_line(int,string){
    const aSpace = document.getElementById('answerSpace')
    const underline = document.createElement('div')
    underline.setAttribute('id',`line_${int}`)
    underline.setAttribute('class',`answerlines`)
    underline.innerText = string
    answerSpace.appendChild(underline)
}

function create_space(int){
    const aSpace = document.getElementById('answerSpace')
    const underline = document.createElement('div')
    underline.setAttribute('id',`line_${int}`)
    underline.setAttribute('class',`answerlines`)
    underline.innerText = ' '
    answerSpace.appendChild(underline)
}

function build_keyboard(){
    const keyRow1 = document.getElementById('alpha_row_1')
    const keyRow2 = document.getElementById('alpha_row_2')
    const keyRow3 = document.getElementById('alpha_row_3')
    ALPHA_1.map((elem)=>{build_keys(keyRow1, elem)})
    ALPHA_2.map((elem)=>{build_keys(keyRow2, elem)})
    ALPHA_3.map((elem)=>{build_keys(keyRow3, elem)})

    if (/\d/.test(ANSWER) == true){
        const keyRow4 = document.getElementById('alpha_row_4')
        ALPHA_4.map((elem)=>{build_keys(keyRow4, elem)})
    }
}

function build_keys(keyRow, elem){
    const keyline = document.createElement('a')
    keyline.setAttribute('id',`${elem}`)
    keyline.setAttribute('href',"#")
    keyline.innerText = `${elem}`

    keyline.style.backgroundColor = "black"
    keyline.style.color = "whitesmoke"
    keyline.style.transition = "background-color 2s, border-color 2s"
    keyline.style.border = "1.8rem solid black"
    keyline.style.width = "auto"
    keyline.style.borderRadius = "50%"

    keyRow.appendChild(keyline)
    keyline.addEventListener('click',validate_answer)
}

function validate_answer(){
    const answer_input = event.target.id
    let dummy;

    if (ANSWER_LIST.includes(answer_input)){
        for (i=0;i<ANSWER_LIST.length;i++)
        {
            if (ANSWER_LIST[i] === answer_input)
            {
                dummy = document.getElementById(`line_${i}`)
                dummy.innerText = answer_input;
                this.style.backgroundColor = "blue";
                this.style.borderColor = "blue";
                WIN_PROGRESS += 1;
            }
        }
    } else {
        this.style.backgroundColor = "#8B0000";
        this.style.borderColor = "#8B0000";
        PLAYER_LIVES -= 1;
        hangMan_countdown()
    }
    this.removeEventListener('click',validate_answer)
    if (is_player_winning() == true)
    {
        next_round()
    }
}

function is_player_winning(){
    if (WIN_PROGRESS == WIN_CRITERIA){
        SCORE += 1;
        return true
    } else {
        return false
    }
}

function next_round(){
    WIN_PROGRESS = 0;
    WIN_CRITERIA = 0;
    ANSWER_LIST = [];
    ANSWER = '';
    PLAYER_LIVES = 7;

    QUESTION = NEXT_QUESTION;
    ANSWER = NEXT_ANSWER;

    const score_tab = document.getElementById("score")
    score_tab.innerText = `SCORE: ${SCORE}`

    //TODO: Display an congratulations message before proceeding
    setTimeout(()=>{
        build_question();
        destroy_content('answerSpace')
        destroy_content('alpha_row_1')
        destroy_content('alpha_row_2')
        destroy_content('alpha_row_3')
        destroy_content('moodSpace')
        try {
            destroy_content('alpha_row_4')
        } catch(error){null}

        build_try_answer();
        build_keyboard();
    },1000)
}

function game_over() {
    destroy_content('answerSpace')
    for (i=0;i<ANSWER.length;i++){
        if (ANSWER_LIST[i] == " "){
            create_space(i)
        } else {
            build_line(i,ANSWER_LIST[i])
        }
    }

    const moodSpace = document.getElementById("moodSpace")
    const gameOver = document.createElement("div")
    gameOver.setAttribute('id','gameOver')
    gameOver.innerText = "GAME OVER"
    moodSpace.appendChild(gameOver)

    if (SCORE > HIGH_SCORE){
        HIGH_SCORE = SCORE
        localStorage.setItem('High Score',HIGH_SCORE)
        const newHighScore = document.createElement("div")
        newHighScore.setAttribute('id','newHighScore')
        newHighScore.innerText = `Great. Seems you have a new high score of ${HIGH_SCORE}`
        moodSpace.appendChild(newHighScore)
    }

    const playAgain = document.createElement("div")
    playAgain.setAttribute('id','playAgain')
    playAgain.innerText = "PLAY AGAIN"
    moodSpace.appendChild(playAgain)

    const answerSpace = document.getElementById("answerSpace")
    answerSpace.style.backgroundColor = "#8B0000";

    //TODO: Add event Listener
    playAgain.addEventListener('click',function(){
        answerSpace.style.backgroundColor = "black";
        next_round()
    })

    destroy_content('alpha_row_1')
    destroy_content('alpha_row_2')
    destroy_content('alpha_row_3')
    try {
        destroy_content('alpha_row_4')
    } catch(error){null}
}


function one_click_destroy(id) {
    const destruct = document.querySelector(id);
    destruct.addEventListener('click',function(){
        destruct.remove();
        STAGE += 1;
        console.log(STAGE)});
}

function destroy_content(parent){
    const parentDiv = document.getElementById(parent)
    while (parentDiv.firstChild){
        parentDiv.removeChild(parentDiv.firstChild)
    }
}

// function snow_falling(snow){
//     let twinkle = 0
//     SNOW_FALLING = setInterval(() => {
//         if (twinkle)
//     },500)
// }

function create_snow(){

    const ceiling = document.getElementById('hang_space')
    const snow = document.createElement('div')

    snow.setAttribute('id', 'snow')
    ceiling.append(snow)

    snow_falling(snow)
}