-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2025 at 10:01 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sokolangu_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `MsgID` varchar(100) NOT NULL,
  `SenderID` varchar(100) NOT NULL,
  `ReceiverID` varchar(100) NOT NULL,
  `Message` varchar(1000) NOT NULL,
  `Seen` varchar(10) DEFAULT 'No',
  `Date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`MsgID`, `SenderID`, `ReceiverID`, `Message`, `Seen`, `Date`) VALUES
('msg_8aa1dd90', 'user_41vXZ7MN', 'user_6Jc4W93d', 'Hello, I\\\'ve just placed an order. Kindly review and respond as soon as possible. Thank you!', 'Yes', '2025-02-10 07:19:19'),
('msg_c6a5f561', 'user_41vXZ7MN', 'user_6Jc4W93d', 'Kindly awaiting your reply...', 'Yes', '2025-02-10 07:19:51');

-- --------------------------------------------------------

--
-- Table structure for table `orders_table`
--

CREATE TABLE `orders_table` (
  `OrderID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL,
  `ProductID` varchar(100) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `TotalPrice` varchar(50) NOT NULL,
  `OrderStatus` varchar(50) DEFAULT 'Pending',
  `OrderDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders_table`
--

INSERT INTO `orders_table` (`OrderID`, `UserID`, `ProductID`, `Quantity`, `TotalPrice`, `OrderStatus`, `OrderDate`) VALUES
('order_8cb38f30', 'user_41vXZ7MN', 'product_EGdJ2fpx', 50, '250', 'Pending', '2025-02-10 07:19:19');

-- --------------------------------------------------------

--
-- Table structure for table `products_table`
--

CREATE TABLE `products_table` (
  `ProductID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(500) NOT NULL,
  `Price` varchar(50) NOT NULL,
  `Category` varchar(100) NOT NULL,
  `UploadDate` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products_table`
--

INSERT INTO `products_table` (`ProductID`, `UserID`, `Image`, `Name`, `Description`, `Price`, `Category`, `UploadDate`) VALUES
('product_EGdJ2fpx', 'user_6Jc4W93d', '1738930955_Tomatoes.jpg', 'Tomatoes', 'Farm-fresh tomatoes Perfect for salads, sauces, salsas, and more, these versatile tomatoes are priced at just Ksh 5 each. Order now and experience the freshness.', '5', 'Vegetables', '2025-02-07'),
('product_LLskvVVw', 'user_DMNrNbyT', '1739087435_Cabbages.jpg', 'Cabbages', 'Fresh cabbages directly from the farm.', '3', 'Vegetables', '2025-02-09'),
('product_PPgfWCbv', 'user_6Jc4W93d', '1738931016_Kales.jpg', 'Kales', 'A Sukuma Wiki that is as clean as the farm. Enjoy the freshness from just 3 bob each.', '3', 'Vegetables', '2025-02-07');

-- --------------------------------------------------------

--
-- Table structure for table `reset_temp`
--

CREATE TABLE `reset_temp` (
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reset_temp`
--

INSERT INTO `reset_temp` (`email`, `token`, `expDate`) VALUES
('jumagobe3@gmail.com', '768e78024aa8fdb9b8fe87be86f647457e338b0259', '2025-02-11 07:47:30'),
('jumagobe3@gmail.com', '768e78024aa8fdb9b8fe87be86f64745b6c4883fcc', '2025-02-11 07:47:34'),
('jumagobe3@gmail.com', '768e78024aa8fdb9b8fe87be86f647455502e0f196', '2025-02-11 07:47:37'),
('jumagobe3@gmail.com', '768e78024aa8fdb9b8fe87be86f647459d3c2eb5ef', '2025-02-11 07:47:40');

-- --------------------------------------------------------

--
-- Table structure for table `users_table`
--

CREATE TABLE `users_table` (
  `UserID` varchar(100) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `PhoneNo` varchar(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Region` varchar(100) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `JoinedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `Status` varchar(20) NOT NULL,
  `Photo` varchar(255) NOT NULL,
  `TermsAgreed` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_table`
--

INSERT INTO `users_table` (`UserID`, `Username`, `FirstName`, `LastName`, `PhoneNo`, `Email`, `Region`, `Role`, `Password`, `JoinedDate`, `Status`, `Photo`, `TermsAgreed`) VALUES
('user_1q1UYnh7', 'Saido', 'Said', 'Ibrahim', '0789547623', 'saidibrahim@gmail.com', 'Nairobi', 'farmer', '$2y$10$XkDV6/P9zqENm6M6y3Ea5.DeLeeFSE.em1HD6.ULaJp8.zbVHCpLa', '2025-02-09 18:41:25', '', '', 'Agreed'),
('user_41vXZ7MN', 'Jumanji', 'Juma', 'Chaje', '0799333216', 'jumagobe03@gmail.com', 'Nairobi', 'consumer', '$2y$10$2RWF7Ewy18cJdBmw0UA1m.Sc8qIMHJ9ZU3mO2wxJ0rbtezXGQz/4S', '2025-02-10 07:04:22', 'offline', '1739171062_Jumanji.jpg', 'Agreed'),
('user_6Jc4W93d', 'Jack', 'Jackson', 'Kamau', '0710479134', 'jacksonk@gmail.com', 'Nairobi', 'farmer', '$2y$10$YnlBjkAWZrc1Ju.zX8k1VuAkgHTo/B9JruXiYF270S3AuXKX99mo6', '2025-02-06 18:24:00', 'offline', '1738960081_user_6Jc4W93d.jpg', ''),
('user_admin', 'admin', 'Juma', 'Chaje', '0799333217', 'jumagobe3@gmail.com', 'Nairobi', 'admin', '$2y$10$0SpyQcVj03XHZ//zJUslQ.Uu..dW7yqSrs0EpROMAZlW5x3ObTDnC', '2025-02-09 20:34:08', 'offline', '1739169353_user_admin.jpg', 'Yes'),
('user_DMNrNbyT', 'Halima', 'Halima', 'Waqo', '0743565431', 'halimawaqo@gmail.com', 'Marsabit', 'farmer', '$2y$10$SRDVZto9D2dN2Y40.CpDQOKSZAh/cXXnFGZbe5UHOyG53u3jUHW.2', '2025-02-06 19:06:42', 'offline', '1738953353_user_DMNrNbyT.jpg', ''),
('user_n8gMrWpj', 'Abdize', 'abdi', 'galgalo', '0787520142', 'abdize@gmail.com', 'Isiolo', 'farmer', 'Abdize123', '2025-02-06 19:08:50', 'online', '1739138607_Abdize.png', 'Yes'),
('user_njKTxgbX', 'Manish', 'Mamo', 'Moma', '0123456789', 'manish@gmail.com', 'Nairobi', 'consumer', '$2y$10$7He7E73YUEckp3K22GRyge8yu8OoTkQ0yqZgxvOYzFBhUJLWNejV2', '2025-02-09 18:43:07', '', '', 'Agreed'),
('user_t7HMlBwR', 'Kilo', 'Kamau', 'Kitito', '0789235671', 'kama@gmail.com', 'Nairobi', 'farmer', '$2y$10$aqLobdlUuZp4C2NgFTiRBeYKybyAGph.XwPbqXbge26tuGBSBpX1W', '2025-02-06 19:03:05', '', '', ''),
('user_yKj7UrL6', 'Angy', 'Angela', 'Samson', '0712345678', 'angelasamson5@gmail.com', 'Nakuru', 'farmer', '$2y$10$wbQNVEBycu0eW0Uc6byR9.IqZxCE3vi1.DtTyX3fA3XYl5ayPI9/y', '2025-02-06 18:55:26', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_table`
--

CREATE TABLE `wishlist_table` (
  `WishID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL,
  `ProductID` varchar(100) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wishlist_table`
--

INSERT INTO `wishlist_table` (`WishID`, `UserID`, `ProductID`, `Date`) VALUES
('wish_8b4d9053', 'user_41vXZ7MN', 'product_EGdJ2fpx', '2025-02-10 07:19:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`MsgID`),
  ADD KEY `SenderID` (`SenderID`),
  ADD KEY `ReceiverID` (`ReceiverID`);

--
-- Indexes for table `orders_table`
--
ALTER TABLE `orders_table`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `products_table`
--
ALTER TABLE `products_table`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `users_table`
--
ALTER TABLE `users_table`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `PhoneNo` (`PhoneNo`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `wishlist_table`
--
ALTER TABLE `wishlist_table`
  ADD PRIMARY KEY (`WishID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`SenderID`) REFERENCES `users_table` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`ReceiverID`) REFERENCES `users_table` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `orders_table`
--
ALTER TABLE `orders_table`
  ADD CONSTRAINT `orders_table_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users_table` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_table_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products_table` (`ProductID`) ON DELETE CASCADE;

--
-- Constraints for table `products_table`
--
ALTER TABLE `products_table`
  ADD CONSTRAINT `products_table_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users_table` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_table`
--
ALTER TABLE `wishlist_table`
  ADD CONSTRAINT `wishlist_table_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users_table` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_table_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products_table` (`ProductID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
