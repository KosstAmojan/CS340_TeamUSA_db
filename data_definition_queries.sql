-- Data Definition Queries
-- Authors: James Frys and Matthew Norwood

DROP TABLE IF EXISTS `Parks`;
DROP TABLE IF EXISTS `Rides`;
DROP TABLE IF EXISTS `Guests`;
DROP TABLE IF EXISTS `RidesRating`;
DROP TABLE IF EXISTS `GuestRide`;

-- Define the Parks table
CREATE TABLE `Parks` (
`parkID` int auto_increment not NULL,
`name` varchar(200) not NULL,
`maxOccupancy` int not NULL,
`dateBuilt` date not NULL,
PRIMARY KEY (`parkID`)
) ENGINE=InnoDB;

-- Data dump for Parks table
LOCK TABLES `Parks` WRITE;
INSERT INTO `Parks` (`parkID`, `name`, `maxOccupancy`, `dateBuilt`) VALUES 
(1, 'Magic Kingdom', 100000, '1971-10-01'),
(2, 'EPCOT', 110000,'1982-10-01'),
(3, 'Hollywood Studios', 75000, '1989-05-01'),
(4, 'Animal Kingdom', 60000, '1998-04-22');
UNLOCK TABLES;

-- Define the Rides table
CREATE TABLE `Rides` (
`rideID` int auto_increment not NULL,
`parkID` int not NULL,
`name` varchar(200) not NULL,
`maxOccupancy` int not NULL,
`dateBuilt` date,
`lengthSeconds` int not NULL,
`speedMPH` int not NULL,
`hasLoop` BOOLEAN not NULL,
`heightRestrictionFeet` int NULL,
PRIMARY KEY (`rideID`),
FOREIGN KEY (`parkID`) REFERENCES `Parks` (`parkID`)
) ENGINE=InnoDB;

-- Data dump for Rides table
LOCK TABLES `Rides` WRITE;
INSERT INTO `Rides` (`rideID`, `parkID`, `name`, `maxOccupancy`, `dateBuilt`, `lengthSeconds`, `speedMPH`, `hasLoop`, `heightRestrictionFeet`) VALUES 
(1, 1, 'Space Mountain', 6, '1975-01-15', 180, 27, false, 4),
(2, 2, 'Test Track', 150, '1999-03-17', 300, 65, false, 3),
(3, 4, 'Kali River Rapids', 6, '1999-03-18', 300, 50, false, 3),
(4, 3, 'Slinky Dog Dash', 18, '2018-06-30', 120, 40, false, 4)
;
UNLOCK TABLES;

-- Define the Guests table
CREATE TABLE `Guests` (
`guestID` int auto_increment not NULL,
`firstName` varchar(200) not NULL,
`lastName` varchar(200) not NULL,
`age` int not NULL,
`heightFeet` int not NULL,
`heightInches` int not NULL,
`parkID` int not NULL,
PRIMARY KEY (`guestID`),
FOREIGN KEY (`parkID`) REFERENCES `Parks` (`parkID`)
) ENGINE=InnoDB;

-- Data dump for Guests table
LOCK TABLES `Guests` WRITE;
INSERT INTO `Guests` (`guestID`, `firstName`, `lastName`, `age`, `heightFeet`, `heightInches`, `parkID`) VALUES 
(1, 'Josh', 'Allen', 25, 7, 84, 4),
(2, 'Steve', 'Snyder', 39, 6, 72, 1),
(3, 'John', 'Jacob', 47, 6, 72, 3),
(4, 'Suzie', 'Queue', 8, 3, 36, 2)
;
UNLOCK TABLES;

-- Define the RidesRating table
CREATE TABLE `RidesRating` (
`guestRideID` int auto_increment not NULL,
`guestID` int not NULL,
`rideID` int not NULL,
`rideDateTime` datetime not NULL,
`ratingValue` int not NULL,
PRIMARY KEY (`guestRideID`),
FOREIGN KEY (`guestID`) REFERENCES `Guests` (`guestID`),
FOREIGN KEY (`rideID`) REFERENCES `Rides` (`rideID`)
) ENGINE=InnoDB;

-- Data dump for RidesRating table
LOCK TABLES `RidesRating` WRITE;
INSERT INTO `RidesRating` (`guestRideID`, `guestID`, `rideID`, `rideDateTime`, `ratingValue`) VALUES 
(1, 1, 3, '2021-11-9 20:20:20', 5),
(2, 3, 4, '2021-10-1 13:01:38', 1),
(3, 2, 1, '2021-11-2 18:59:59', 4),
(4, 4, 2, '2021-10-1 13:01:38', 5)
;
UNLOCK TABLES;

-- Define GuestRide table
CREATE TABLE `GuestRide` (
`guestID` int not NULL,
`rideID` int not NULL,
PRIMARY KEY (`guestID`, `rideID`),
FOREIGN KEY (`guestID`) REFERENCES `Guests` (`guestID`),
FOREIGN KEY (`rideID`) REFERENCES `Rides` (`rideID`)
) ENGINE=InnoDB;

-- Data dump GuestRide table
LOCK TABLES `GuestRide` WRITE;
INSERT INTO `GuestRide` (`guestID`, `rideID`) VALUES
(1, 3),
(3, 4),
(2, 1),
(4, 2)
;
UNLOCK TABLES;

