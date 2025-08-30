/**
 * AUTHOR: Simi Adeniyi
 * 
 * REMARKS: This handles all the game logic surrounding the potato counter and the pps rate
 */

"use strict"

class Counter
{
	//
	//Instance variables
	//
	#count;  //the current amount of potatoes held
	#name;  //id of the counter in the html file
	#htmlCounter;  //the html element representing the counter
	#htmlPPS;  //the html element representing the pps
	#htmlMessage;  //the html element for showing a message
	#htmlAchievement;  //the html element for showing an achievement
	#rate;  //the pps value
	#multiplier;  //a pps multipler (1 by default)
	#bonusButtonList;  //a list of all BonusButtons
	
	//My Instance variables
	#totalPotatoes; //the total amount of potatoes made. Used to keep track of whether an achievement has ben reached.
	#achievement; //the achievement value in powers of 10
	#numAchievement; //number of achievements reached

	#messageList; //an array of messages to be displayed

	//
	//Class constants
	//
	static get #INTERVAL() { 

		return 50;
	}  //setting the interval to 50 milliseconds

	static get #SECOND_IN_MS() { //conversion from seconds to milliseconds

		 return 1000;
	}  //one second in milliseconds

	static get DEFAULT_MESSAGE_DURATION() {  //how long the message should be shown

		return 5;
	 }  //in seconds
	

	 //My Class constants
	 static get #SHOW_TIME() { //how long the bonus should be shown on the screes

		return 10 * Counter.#SECOND_IN_MS;
	 }//in milliseconds

	 static get #BONUS_INTERVAL_TIME() { //the interval between showing bonuses
		
		return 90 * Counter.#SECOND_IN_MS;
	 }//in milliseconds


	 //Getters
	 get totalPotatoes() { 
		return this.#totalPotatoes;
	 }  

	 get numAchievement() {

		return this.#numAchievement;
	 }
	//
	//Constructor
	//
	constructor(name, pps, messageBox, achievementBox)
	{
		this.#count = 0;
		this.#name = name; 
		this.#htmlCounter = document.getElementById(name);
		this.#htmlPPS = document.getElementById(pps);
		this.#htmlMessage = document.getElementById(messageBox);
		this.#htmlAchievement = document.getElementById(achievementBox);
		this.#rate = 1;
		this.#multiplier = 1;
		this.#initCounter();
		this.#bonusButtonList = [];

		//My addition
		this.#totalPotatoes = 0;
		this.#scheduleBonus(); //bonus is sheduled from when the program starts
		this.#achievement = 10; //first achievement is 10 potatoes
		this.#numAchievement = 0;

		this.#messageList = [
			"The secret to a great potato is patience.",
            "Potatoes are like friends; they make life more enjoyable.",
            "Potato power: unlimited energy, zero calories!",
            "If potatoes could talk, they would be the life of the party.",
            "You can never have too many potatoes!", "You're a potato master!",
			"Potatoes are watching you…",
			"Keep clicking, the potatoes are multiplying!",
			"This potato loves you!",
			"You’ve unlocked the secret potato!",
			"Potato power is increasing!",
			"You're one click away from greatness!",
			"Have you tried turning it off and on again?",
			"Warning: Too many potatoes may cause an overload!",
			"Did someone say… crispy fries?",
			"Potato wisdom: Always butter your fries.",
			"Clicking potatoes... one click at a time.",
			"You’ve earned the Golden Potato!",
			"The potatoes are plotting their revenge!",
			"More potatoes, more power!",
			"Did you know? Potatoes were once worshipped as gods.",
			"Level up your potato game!",
			"You’re becoming a potato prodigy!",
			"Potatoes can’t be stopped. Neither can you.",
			"Warning: Potato overload imminent!"];

			this.scheduleMessage();
	}
	
	//Top secret...
	cheatCode()
	{
		this.#count = 50000000;
	}
	
	//Method that regularly updates the counter and pps texts
	#updateCounter() 
	{
		let time = Counter.#INTERVAL / Counter.#SECOND_IN_MS; //convert time to milliseconds using class constants

		let	potatoes = this.#rate * this.#multiplier * time; // calculate the number of potatoes to add
		// this.#htmlMessage.innerText = theMessage;

		this.#count += potatoes;  //increment count

		this.#totalPotatoes += potatoes; //update the total potatoes
		this.#checkAchievements(); //check if an achievement has been reached
		// this.#htmlMessage.innerText = theMessage;

		setInterval(this.#updateTitle.bind(this), Counter.#INTERVAL);
		
		this.#htmlCounter.innerText = `Counter: ${Math.round(this.#count).toLocaleString()} potatoes`; // Display the counter
		this.#htmlPPS.innerText = `Potatoes per second: ${(this.#rate * this.#multiplier)} pps`; //display the pps text

	}
	
	//Starting the counter and making sure that it updates every Counter.#INTERVAL milliseconds
	#initCounter()
	{
		setInterval(this.#updateCounter.bind(this), Counter.#INTERVAL);
	}
	
	//Method that can be used to present a message: 
	//either a regular message (when the achievement parameter is set to false) OR
	//an achievement message (when the achievement parameter is set to true).
	showMessage(theMessage, time=Counter.DEFAULT_MESSAGE_DURATION, achievement = false)  //time is in seconds;
	{
		let theElement = this.#htmlMessage;

		if (achievement)
			theElement = this.#htmlAchievement;
		theElement.innerHTML = theMessage;
		theElement.classList.remove("hidden");
		
		//The following statement will make theElement invisible again after [time] seconds
		setTimeout(() => {theElement.classList.add("hidden");}, time*Counter.#SECOND_IN_MS);
	}


	//NEW METHODS

	//adds a new number of potatoes to the current count  for a clicking button
	addPotatoes(num) {

		this.#count += num;
		this.#totalPotatoes += num;

		// show a +1 message for a tenth of a second
		this.showMessage('+1', 0.1);
	}

	/**
	 * checkBuildingPurchase
	 * 
	 * @param {*} cost  cost of the building
	 * @param {*} ppsRate  rate increase for the building
	 * @returns true is we have enough potatoes to purchase a buliding and false otherwise
	 * 
	 * Checks if the current potato count is enough to buy a new building. If it is, we decrement the potato count by the cost
	 * and increase the rate by the new rate value
	 */
	checkPurchase(cost, ppsRate) {

		if(this.#count >= cost) {

			this.#count -= cost; //decrement count
			this.#rate += ppsRate; //increase rate

			return true;
		}

		return false; //not enough potatoes
	}

	addBonusButton(button) { //adds a bonus button to the array

		this.#bonusButtonList.push(button);
	}

	/**
	 * Show a series of random messages form the messageList array
	 */
	showMessages() {

		let messageIcon = document.getElementById("Message Icon");
		let randomMessage = this.#messageList[Math.floor(Math.random() * this.#messageList.length)];

		messageIcon.querySelector('p').textContent =randomMessage; //set the message to therandom message
		messageIcon.classList.remove('hidden'); //display the message

		setTimeout(() => {

			messageIcon.classList.add('hidden'); //hide it after some seconds

		}, Counter.#SHOW_TIME);
	}

	/**
	 * Schedule a message to be displayed
	 *
	 */
	scheduleMessage() {

		setInterval(() => {

			this.showMessages();

		}, Counter.#SHOW_TIME * 2);

	}
	/**
	 * 
	 * @param {*} val the value of the potato count
	 * @param {*} length //duration a potato count is active for
	 * 
	 * sets the potato count to the new value and sets a timer to reset it to 0
	 */
	potatoCount(val, length) {
	}
	/**
	 * 
	 * @param {*} val the multiplier value for a bonus
	 * @param {*} length //duration a bonus is active for
	 * 
	 * sets the bonus to be the new value and sets a timer to reset it to 1
	 */
	bonus(val, length) {

		this.#multiplier = val; //the new multiplier value

		//sets the multiplier back to 1 after the bonus duration is over
		setTimeout( () => { 

				this.#multiplier = 1;
		}, length * Counter.#SECOND_IN_MS);

	}

	/**
	 * schedules a bonus to appear every "set" seconds from when the program starts
	 */

	#scheduleBonus() {

		setInterval(() => { 
			
			if(this.#bonusButtonList.length > 0) { //if the bonus array is not empty

				//width of the screen in pixels
				let width = window.innerWidth;
				let height = window.innerHeight;

				let randomX = Math.floor(Math.random() * (width - 100)); //pick a random x coordinate
				let randomY = Math.floor(Math.random() * (height - 100)); //pick a random y coordinate

				//pick a random bonus button
				let idx = Math.floor(Math.random() * this.#bonusButtonList.length);
				let button = this.#bonusButtonList[idx];

				//the position of the button on the screen
				button.htmlButton.style.left = `${randomX}px`;
				button.htmlButton.style.top = `${randomY}px`;
				
				button.htmlButton.classList.remove("hidden"); //remove the hidden button
				button.htmlButton.classList.add("glowing"); //make it glow

				setTimeout( () => { 
				
					button.htmlButton.classList.remove("glowing"); //remove the glowing effect
					button.htmlButton.classList.add("hidden") //hide the button

				 }, Counter.#SHOW_TIME) //set the button to hidden after the time has passed

			}
		}, Counter.#BONUS_INTERVAL_TIME);
	}

	/**
	 * checks if the total potatoes made is a power of 10 and if so, displays a message
	 */
	#checkAchievements() {

		if(this.#totalPotatoes >= this.#achievement) {  //greater than or equal to in the case where we skip over the achievement value

			//message to be shown
			let message = `New achievement unlocked. You have made ${this.#achievement} potatoes in total!`;
			this.showMessage(message, Counter.DEFAULT_MESSAGE_DURATION, true); 
			this.#achievement *= 10; //multiply achievement by 10
			this.#numAchievement ++;
		}
	}

	#updateTitle() {

		document.title = `${Math.floor(this.#count).toLocaleString()} 🥔`; //update the title
	}
}


