-- Data Manipulation Queries
-- Authors: James Frys and Matthew Norwood
-- NOTE TO GRADER: Please disable foreign key check prior to execution. For values in inserts that will auto-generate, I have left a dummy value. 

-- Query for add a new character functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language

select guestID, rideID from GuestRide where guestID = :guestIDInput;

select age, firstName, guestID, heightFeet, heightInches, lastName, parkID from Guests where age = :ageInput;

select dateBuilt, maxOccupancy, name, parkID from Parks where name = :nameInput;

select dateBuilt, hasLoop, heightRestrictionFeet, lengthSeconds, maxOccupancy, name, parkID, rideID, speedMPH from Rides where lengthSeconds = :lengthSecondsInput;

select guestID, guestRideID, ratingValue, rideDateTime, rideID from RidesRating where RideDateTime > :RideDateTimeInput;

insert into GuestRide (guestID, rideID) values (7, 9); 

insert into Guests (age, firstName, guestID, heightFeet, heightInches, lastName, parkID) 
    values (:ageInput, :firstNameInput, 100, :heightFeetInput, :heightInchesInput, :lastNameInput, :parkIDInput);

insert into Parks (dateBuilt, maxOccupancy, name, parkID) values (:dateBuiltInput, :maxOccupancyInput, :nameInput, 45); 

insert into Rides (dateBuilt, hasLoop, heightRestrictionFeet, lengthSeconds, maxOccupancy, name, parkID, rideID, speedMPH) 
    values (:dateBuiltInput, :hasLoopInput, :heightRestrictionFeetInput, :lengthSecondsInput, :maxOccupancyInput, :nameInput, :parkIDInput, 12, :speedMPHInput); 
    
insert into RidesRating (guestID, guestRideID, ratingValue, rideDateTime, rideID) values (:guestIDInput, 400, :ratingValueInput, :RideDateTimeInput, :rideIDInput);

update GuestRide set rideID = :rideIDInput where guestID = :guestIDInput;

update Guests set firstName = :nameInput where age = :ageInput;

update Parks set maxOccupancy = :maxOccupancyInput where name = :nameInput;

update Rides set hasLoop = :hasLoopInput where rideID = :rideIDInput;

update RidesRating set ratingvalue = :ratingValueInput where guestRideID = :guestRideID;
    
delete from GuestRide where guestID = :guestIDInput;

delete from Guests where age = :ageInput;

delete from Parks where name = :nameInput;

delete from Rides where dateBuilt = :dateBuiltInput;

delete from RidesRating where guestRideID = :guestRideIDInput;


