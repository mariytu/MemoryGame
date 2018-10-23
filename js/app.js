/*
 * Create a list that holds all of your cards
 */
const movesForStar = 15;
let moves = 0;
let stars = 3;
let remainingCards = 16;
let openCard = '';
let startTime = 0;

let cardsElements = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
cardsElements = [...cardsElements, ...cardsElements];
const cardContainer = document.querySelector('.deck');

init();

document.querySelector('.restart').addEventListener('click', init);
cardContainer.addEventListener('click', clickCard);

/**
* @description Shuffle function from http://stackoverflow.com/a/2450976
* @param {array<string>} array - The list of cards elements 2 times each of them
* @returns {array<string>} The same array shuffle randomly
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description This is the click card event. So when card is clicked this function is triggered and 
* perform all the logic for this awesome game!!!
* @param {Event} evt - The triggered event
*/
function clickCard(evt) {
	if (evt.target.className === 'card animated') { //just for cards no matched!!
		const icon = evt.target.firstElementChild;
		const iconClasses = icon.classList;
		
		if (openCard === '') { //There is no card open
			openCard = iconClasses[1];
			evt.target.classList.add('open');
			evt.target.classList.add('show');
			
			//rotate animation
			evt.target.classList.add('flipInY');
		}
		else { //There is another card open! =)
			const currentCard = iconClasses[1];
			
			if (openCard === currentCard) { //Yei!!
				remainingCards -= 2;
				const openCardElement = document.querySelector('.card.open.show');
				openCardElement.classList.remove('open');
				openCardElement.classList.remove('show');
				openCardElement.classList.remove('flipInY');
				openCardElement.classList.add('match');
				evt.target.classList.add('match');
				
				//yei animation
				openCardElement.classList.add('bounce');
				evt.target.classList.add('bounce');
				openCard = '';
			}
			else { //Noup!!
				const openCardElement = document.querySelector('.card.open.show');
				openCardElement.classList.remove('open');
				openCardElement.classList.remove('flipInY');
				openCard = '';
				
				openCardElement.classList.add('error');
				evt.target.classList.add('error');
				evt.target.classList.add('show');
				
				//wrong animation
				openCardElement.classList.add('shake');
				evt.target.classList.add('shake');
				
				const secondCard = evt.target;
				
				//Delete error, animation and visible card when animation ends
				setTimeout(function(){
					openCardElement.classList.remove('show');
					openCardElement.classList.remove('shake');
					openCardElement.classList.remove('error');
					secondCard.classList.remove('show');
					secondCard.classList.remove('shake');
					secondCard.classList.remove('error');
				}, 700);
			}
		}
		
		updateMoves();
		updateStar();
		
		if (remainingCards === 0) { //You win!!!
			launchModal();
		}
	}
}

/**
* @description Launch the congrats modal with play again button.
*/
function launchModal() {
	
	const endTime = performance.now();
	const time = millisToMinutesAndSeconds(endTime - startTime);
	
	const textMessage = `With ${moves} moves and ${stars} stars in ${time}.
						Woooo!!`;
	
	swal({
		title: "Congratulations! You Won!",
		text: textMessage,
		type: "success",
		confirmButtonColor: "#1ab394",
		confirmButtonText: "Play again!"
	},
	function (isConfirm) {
		init();
	});	
}

/**
* @description Transform a milliseconds into minutes and seconds in string format
* http://stackoverflow.com/a/21294302
* @param {int} millis - Milliseconds
* @returns {string} The milliseconds as string like looks like this 4:59
*/
function millisToMinutesAndSeconds(millis) {
	const minutes = Math.floor(millis / 60000);
	const seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds + " " + (minutes === 0 ? 'seconds' : 'minutes');
}

/**
* @description Increase the moves counter and update this in the front end
*/
function updateMoves() {
	moves++;
	const movesContainer = document.querySelector('.moves');
	movesContainer.textContent = moves;
}

/**
* @description Update the star count if the moves pass some value. If this occurs, so the counter in 
* the front end are updated
*/
function updateStar() {
	if (moves % movesForStar == 0) {
		stars--;
		if (stars >= 0) {
			const remainingStars = document.querySelectorAll('.stars .fa-star');
			remainingStars[remainingStars.length - 1].className = 'fa fa-star-o';
		}
	}	
}

/**
* @description Init the default values for moves, star and openCard. Then this are reload in the front end.
* shuffle de icons for the cards and create them and push this into the card container
*/
function init() {
	moves = 0;
	stars = 3;
	remainingCards = 16;
	openCard = '';
	startTime = performance.now();
	
	initElements();
	cardsElements = shuffle(cardsElements);
	
	//We are sure that the cardContainer is empty!!
	removeChildrens(cardContainer);
	/* This doesn't work =/
	cardContainer.remove();
	cardContainer = document.createElement('ul');
	cardContainer.className = 'deck';
	*/
	
	for (const item of cardsElements) {
		const card = document.createElement('li');
		card.className = 'card animated';
		
		const icon = document.createElement('i');
		icon.className = 'fa ' + item;
		
		card.appendChild(icon);
		cardContainer.appendChild(card);
	}
	
	/* This doesn't work =/
	document.querySelector('.score-panel').insertAdjacentHTML('afterend', cardContainer);
	*/
}

/**
* @description Init the elements at score panel
*/
function initElements() {
	//init for moves
	const movesContainer = document.querySelector('.moves');
	movesContainer.textContent = moves;
	
	//init for stars
	const allStars = document.querySelectorAll('.stars .fa');
	for (const star of allStars) {
		star.className = 'fa fa-star';
	}
}

/**
* @description Remove all childrens of some element from http://stackoverflow.com/a/683429
* @param {HTMLElement} node - Some element of the DOM
*/
function removeChildrens(node) {
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
}