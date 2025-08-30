/**
 * AUTHOR: Simi Adeniyi
 * CLASS: Comp 2150 A01
 * ASSIGNMENT: 4
 * 
 * REMARKS: This contains all different types of buttons and their respective actions
 */

"use strict"

class Button
{
	//
	//Instance variables
	//
	#name; //buton name
	#counter; //counter object
	#htmlButton;
	
	//
	//Class constants
	//
	static get TEXT_ATTRIBUTE() { 

		return "-text";
	}
	

	//
	//Constructor
	//
	constructor(name, counter)
	{
		//throw an error when a button is about to be instantiated
		if(this.constructor.name === "Button") {

			throw new Error("This class is an abstract class and cannot be instantiated");
		} else {

			this.#name = name;
			this.#counter = counter;
			this.#htmlButton = document.getElementById(name);
		}
		
		// Add a click event listener to the button
		this.#htmlButton.addEventListener('click', this.clickAction.bind(this)); //this has a different meaning in this context, so I need to bind my method to it
	}
	
	//Updating the innerHTML text of the button 
	//(note that not all types of buttons have text, but I placed this here to give that code to you)
	updateText(newText)
	{
		document.getElementById(this.name + Button.TEXT_ATTRIBUTE).innerHTML = newText;
	}
	

	//Additions 
	clickAction() { //called when a user clicks a button. Inherited by buttons' subclasses

		throw new Error("Abstract method not meant to be implemented");
	}

	//
	//Accessors below that you might find useful
	//
	get name()
	{
		return this.#name;
	}
	
	get counter()
	{
		return this.#counter;
	}
	
	get htmlButton()
	{
		return this.#htmlButton;
	}
}


//represents a big potato button that can be clicked to get +1 potato
class ClickingButton extends Button {

	//Instance variables
	#amount; //the amount of potatoes that the button produces

	constructor(name, counter) {

		super(name, counter); 

		this.#amount = 1;
	}

	//add potatoes to the counter
	clickAction() {

		this.counter.addPotatoes(this.#amount);
		
	}

}

/**
 * this button subclass produces potatoes at a fixed rate depending on the type of building
 * 
 * Farm: 1 pps
 * Food Truch: 5 pps
 * Chips Factory: 50 pps
 * Potato cloner: 250 pps
 */

class BuildingButton extends Button {

	#initPrice; //the starting price of the building
	#increaseRate; //the pps a building gives

	#increaseFactor; //the factor by which the price of a building increases after each purchase
	#currPrice; //the new price after each purchase (after applying increaseFactor)

	#ownedBuilding; //number of buildings owned (has to reflect on the page)

	constructor(name, counter, initPrice, increaseRate) {

		super(name, counter);

		this.#initPrice = initPrice;
		this.#increaseRate = increaseRate;

		this.#currPrice = initPrice;
		this.#increaseFactor = 1.5;

		this.#ownedBuilding = 0;
	}

	//Getters and Setters
	get initPrice() {

		return this.#initPrice;
	}

	get increaseRate() {

		return this.#increaseRate;
	}

	get ownedBuilding() {

		return this.#ownedBuilding;
	}
	
	get currPrice() {

		return this.#currPrice;
	}

	set increaseRate(newRate) {

		this.#increaseRate = newRate;
	}

	/**
	 * Adds the pps to the counter when a building button is clicked.
	 * Also updates the text of the button to reflect the new price and the pps added.
	 */
	clickAction() {

		let newRate = this.#increaseRate; //the new rate (or pps level) after purchase
	
		if(this.counter.checkPurchase(this.#currPrice, newRate)) {  //first check if we can purchase the building
			
			this.#currPrice =  Math.floor (this.#increaseFactor * this.#currPrice); //change the price of the building. Round down to the nearest integer
			this.#ownedBuilding++; //increase building number by 1

			//the new text to be displayed on the button
			let newText = `${this.#ownedBuilding} ${this.name} <br>Cost: ${this.#currPrice.toLocaleString()}🥔<br>Adds: ${this.#increaseRate.toLocaleString()} pps`;

			this.updateText(newText); //an inherited method
		}
	}
	
}

/**
 * this button subclass upgrades a building by increasing its pps value by a factor of 2.
 * 
 * Harvester: Farm
 * Poutine maker: Food Truck
 * Instant fryer: Chips Factory
 * Advanced DNA: Potato cloner
 */
class UpgradeButton extends Button {

	#initPrice; //starting price of an upgrade
	#multiplier; //factor with which it increases the pps value of the building
	#building; //building it upgrades
	#ownedUpgrades; //number of upgrades
	#currPrice; //price after each purchase

	constructor(name, counter, initPrice, factor, building) {

		super(name, counter);

		this.#initPrice = initPrice;
		this.#multiplier = factor;
		this.#building = building;

		this.#ownedUpgrades = 0;
		this.#currPrice = initPrice;
	}

	//Getters
	get initPrice() {

		return this.#initPrice;
	}

	/**
	 * Upgrades the respecting building when an upgrade button is clicked.
	 * Also updates the text of the button to reflect the new price and the pps added.
	 */
	clickAction() {

		//the new pps value of the building is calculated. 
		let newBuildingRate =  this.#building.increaseRate * this.#multiplier;

		//this represents the pps increase that will be added to counter. It depends on the number of buildings owned.
		let newPPS = (newBuildingRate - this.#building.increaseRate) * this.#building.ownedBuilding;

		if(this.counter.checkPurchase(this.#currPrice, newPPS)) { //check is it is a valid purchase
			
			this.#currPrice *= 5; //increase the price of upgrade by a factor of 5

			this.#ownedUpgrades++; //increase the number of upgrades
			
			this.#building.increaseRate = newBuildingRate; //set the building's pps to this new rate. Old pps * 2

			//update the text of the building and the upgrade button
			let buildingText =  `${this.#building.ownedBuilding} ${this.#building.name} <br>Cost: ${this.#building.currPrice.toLocaleString()}🥔<br>Adds: ${this.#building.increaseRate.toLocaleString()} pps`;
			this.#building.updateText(buildingText);

			let newText =  `${this.#ownedUpgrades} ${this.name} <br>Cost: ${this.#currPrice.toLocaleString()}🥔<br>${this.#building.name} prod. x2`;
			this.updateText(newText); 
		}
	}

}


/**
 * this button subclass produces bonus buttons that initiates a bonus pps multiplier for a specific duration.
 * 
 */
class BonusButton extends Button {

	#multiplier; //increases the pps by this factor
	#duration; //bonus' active time in seconds

	constructor(name, counter, val, length) {

		super(name, counter);

		this.#multiplier = val;
		this.#duration = length;

		//the button is hidden by default
		this.htmlButton.classList.add("hidden");
	}

	/**
	 * Handles the click event of the button.
 	*/
	clickAction() {

		//activate the bonus
		this.counter.bonus(this.#multiplier, this.#duration);

		//shows a bonus clicked message with the details of the bonus
		let message = `${this.name} started! <br> ${this.#multiplier} x pps for ${this.#duration} seconds!`;
		this.counter.showMessage(message, Counter.DEFAULT_MESSAGE_DURATION, false);

		this.htmlButton.classList.add("hidden"); //hide the button after it's been clicked
	}
}