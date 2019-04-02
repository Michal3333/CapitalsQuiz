let numberOfQ = 4;
let points = 0;
let type = 0;
let wrongs =0;
let questionCount = 0;
let questionCap = 5;

function sendNumberOfAnsweres(num){
    $.post('http://localhost:8080/numberOfAnsweres',{"val": num})
}
function sendRegion(num){
    $.post('http://localhost:8080/region',{"val": num})
}

function clear() {
    points = 0;
    wrongs = 0;
    questionCount = 0;
    $('#points').empty();
}
function opinion(val) {
    if(val <= 3) return 'Ehhh.....';
    else if(val <= 6) return 'Not That Bad.';
    else if(val <= 9) return 'You are learing quickly.';
    else if(val <= 13) return 'Nice.';
    else if(val <= 15) return 'Great.';
    else if(val <= 18) return 'Amazing!';
    else if(val > 18) return 'Genius!!!'
}
function createPoints() {
    for(let k = 0;k<questionCap;k++){
        $('#points').append('<li class="point"></li>')
    }
}
function colorPoint(answere) {
    toColor = $('#points li')[questionCount];
    if(answere === 0){
        $(toColor).css('backgroundColor','green')
    }
    else {
        $(toColor).css('backgroundColor','red')
    }
}

function showSettings(){
    $(this).text("Save Settings");
    $('#more').slideDown();
    $(this).one('click',function () {
        $(this).text("Settings");
        $(this).one('click',showSettings);
        sendRegion($('#region').val())
        sendNumberOfAnsweres($('#number').val());
        numberOfQ = parseInt($('#number').val());
        if($('#type').val() === 'Hot Streak') type = 0;
        else{type = 1;}
        $('#more').slideUp();
    })
}

function nextQuestion() {
    $('#question').slideUp(() =>{
        questionCount++;
        $('#next').hide();
        $('#next').css('transitionDuration','');
        $('ul#answeres').empty();
        if(wrongs===0 && type ===0) getQuestion();
        else if(type===0){
            $('#info').text(`Streak ${points} ${opinion(points)}`);

            $('#end').slideDown();
        }
        else if(type === 1 && questionCount<questionCap) getQuestion();
        else{
            $('#info').text(`You scored ${points}/${questionCap}`);
            $('#end').slideDown();
        }
    });

}
function clickRight(e){
    points++;
    if(type === 1) colorPoint(0);
    $(e.currentTarget).css('backgroundColor','green');
    let rest = $('.newans');
    for(let i =0;i<rest.length;i++){
        $(rest[i]).off();
    }
    $('#next').slideDown(() =>{
        $('#next').css('transitionDuration', '0.4s');
    })
}

function clickWrong(e){
    wrongs++;
    if(type === 1) colorPoint(1);
    $(e.currentTarget).css('backgroundColor','red');
    $('.rightAnswere').css('backgroundColor','green');
    let rest = $('.ans');
    for(let i =0;i<rest.length;i++){
        $(rest[i]).off();
    }
    if(type===0)$('#next').text('Continue');
    $('#next').slideDown(() =>{
        $('#next').css('transitionDuration', '0.4s');
    })
}

function getQuestion(){
    $.get('http://localhost:8080/question',(data) =>{
        let o = data;
        for(let k = 0;k<numberOfQ;k++){
            $('ul#answeres').append('<li class="ans newans"></li>')
        }
        let right = Math.floor(Math.random()*numberOfQ);
        right = $('ul#answeres li')[right];
        $(right).addClass('rightAnswere');
        $(right).removeClass('newans');
        $(right).text(o.right);
        $(right).one('click',clickRight);
        let wrong =$('ul#answeres li.newans');
        if(type === 1 && questionCount === 0){
            createPoints();
            $('.point').show()
        }
        for(let k=0;k<numberOfQ-1;k++){
            $(wrong[k]).text(o.wrong[k]).one('click',clickWrong);
        }
        $('.qpart').text(`What is the capital of ${o.question}?`);
        $('#startMenu').slideUp(()=>{
            $('#question').slideDown();
        });
    })
}

function quit(){
    clear();
    $('#end').slideUp(() =>{
        if(type === 1) $('.point').hide();
        $('#startMenu').slideDown();
    });
}

$(document).ready(function () {
    console.log("zaladowano");
    $('#settab').one('click',showSettings);
    $('.start').on('click',getQuestion);
    $('#next').on('click',nextQuestion);
    $('#continue').on('click',quit);
});
