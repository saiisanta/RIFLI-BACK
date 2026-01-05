-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: rifli_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Carts`
--

DROP TABLE IF EXISTS `Carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL,
  `ProductId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `carts_ibfk_10` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `carts_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `carts_ibfk_6` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `carts_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Carts`
--

LOCK TABLES `Carts` WRITE;
/*!40000 ALTER TABLE `Carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `Carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `price` float NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `stock` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,'UTP Cat5e 305m','Bobina de cable de red UTP Cat5e, 305 metros, ideal para LAN 1 Gbps.','/api/images/Cables.png',85.99,'Cables','Generic',116,'2025-06-09 05:49:49','2025-06-30 22:06:39'),(2,'Coaxial RG59 100m','Bobina de 100 metros de cable coaxial RG59 para cámaras y TV analógica.','/api/images/Cables.png',45.5,'Cables','Generic',75,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(3,'HDMI 2.0 – 3m','Cable HDMI 2.0 alta velocidad, 4K@60Hz, 3 metros, compatible con todos los dispositivos.','/api/images/Cables.png',12.3,'Cables','Belkin',200,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(4,'IPC-HFW1230S','Cámara bullet 2MP Dahua, lente 3.6 mm, visión nocturna EXIR 30 m, IP67.','/api/images/Camaras.png',59.99,'Cámaras','Dahua',45,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(5,'HAC-HFW1200R','Cámara HDCVI 2MP Dahua, lente 2.8 mm, IR 20 m, resistente al agua (IP67).','/api/images/Camaras.png',49.75,'Cámaras','Dahua',60,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(6,'GN-2MP-Bullet','Cámara bullet 2MP Garnet, lente 3.6 mm, IR 25 m, carcasa metálica IP66.','/api/images/Camaras.png',52,'Cámaras','Garnet',30,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(7,'GN-4MP-Domo','Cámara domo 4MP Garnet, lente varifocal 2.8–12 mm, IP66, micrófono integrado.','/api/images/Camaras.png',88.4,'Cámaras','Garnet',25,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(8,'ProCam 1.3MP','Cámara seguridad DSC 1.3MP, lente 2.8 mm, IR 15 m, carcasa plástica resistente.','/api/images/Camaras.png',35.2,'Cámaras','DSC',50,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(9,'NBN-73023BA','Cámara IP 1080p Bosch, lente 2.8 mm, WDR 120 dB, audio bidireccional, IP67.','/api/images/Camaras.png',299,'Cámaras','Bosch',10,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(10,'NDP-7512-Z30','Cámara PTZ 2MP Bosch, zoom 30x, WDR, visión nocturna, IK10 antivandálica.','/api/images/Camaras.png',1200.5,'Cámaras','Bosch',5,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(11,'DS-2CD2043G0-I','Cámara IP 4MP Hikvision, lente 2.8 mm, IR 30 m, slot microSD.','/api/images/Camaras.png',79.99,'Cámaras','Hikvision',40,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(12,'DS-2CE16D8T-IT3F','Cámara Turbo HD 2MP Hikvision, lente 2.8 mm, IR EXIR 40 m, IP66.','/api/images/Camaras.png',29.5,'Cámaras','Hikvision',70,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(13,'IPC-F22FP','Cámara domo 1080p Imou, lente 2.8 mm, audio bidireccional, IR 30 m.','/api/images/Camaras.png',45,'Cámaras','Imou',55,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(14,'Tapo C200','Cámara IP 1080p Tapo, giro 360°, audio bidireccional, detección de movimiento.','/api/images/Camaras.png',39.99,'Cámaras','TP-Link',80,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(15,'XVR5104HS','DVR 4 canales Dahua HDCVI/Analog/IP, HDMI, grabación 1080p en todos los canales.','/api/images/DVR.png',89.99,'DVR','Dahua',20,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(16,'DS-7204HQHI-K1','DVR 4 canales Turbo HD Hikvision, compresión H.265+, HDMI y VGA, plug&play.','/api/images/DVR.png',95.5,'DVR','Hikvision',18,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(17,'GN-DVR-16','DVR 16 canales 1080p Garnet, salida HDMI, soporte P2P, grabación remota.','/api/images/DVR.png',120.75,'DVR','Garnet',12,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(18,'Taladro Inalámbrico 18V','Taladro a batería 18V con dos velocidades, batería 1.5Ah, incluye brocas básicas.','/api/images/Herramientas.png',55,'Herramientas','Black+Decker',35,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(19,'Multímetro Digital MX-328','Multímetro digital MX-328 autorango: mide voltaje, corriente, resistencia, diodos.','/api/images/Herramientas.png',12.99,'Herramientas','Fluke',60,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(20,'Destornillador de Precisión (Set 6 pz)','Juego de destornilladores de precisión para electrónica y reparaciones pequeñas.','/api/images/Herramientas.png',9.5,'Herramientas','Stanley',100,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(21,'Placa Yeso Durlock 1.20×2.40m','Placa de yeso laminado Durlock, grosor 12 mm, para cielorrasos y tabiquería.','/api/images/Durlock.png',8.75,'Durlock','Durlock',200,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(22,'Placa Acústica Durlock 1.20×2.40m','Placa acústica Durlock 12 mm, tratamiento de sonido, ideal para estudios.','/api/images/Durlock.png',12,'Durlock','Durlock',80,'2025-06-09 05:49:49','2025-06-09 05:49:49'),(23,'Nigga 30m','No doy más wacho llevame con voss yimi hnito porfavor wacho levantate xq no te quedaste en casa wacho turro chispa veni vamos a tomar un tussi y curtir el mambo entre nosotros como lo hacíamos siempre hnito',NULL,100,'Cables','Generic',5,'2026-01-03 21:06:23','2026-01-03 21:06:23'),(24,'Nigga','No doy más wacho llevame con voss yimi hnito porfavor wacho levantate xq no te quedaste en casa wacho turro chispa veni vamos a tomar un tussi y curtir el mambo entre nosotros como lo hacíamos siempre hnito',NULL,40000,'Down','HP',10,'2026-01-05 00:56:10','2026-01-05 00:56:10');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Quotes`
--

DROP TABLE IF EXISTS `Quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `details` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL,
  `ServiceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `ServiceId` (`ServiceId`),
  CONSTRAINT `quotes_ibfk_10` FOREIGN KEY (`ServiceId`) REFERENCES `Services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quotes_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quotes_ibfk_6` FOREIGN KEY (`ServiceId`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quotes_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Quotes`
--

LOCK TABLES `Quotes` WRITE;
/*!40000 ALTER TABLE `Quotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Services`
--

DROP TABLE IF EXISTS `Services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Services`
--

LOCK TABLES `Services` WRITE;
/*!40000 ALTER TABLE `Services` DISABLE KEYS */;
/*!40000 ALTER TABLE `Services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Administrador','admin@rifli.com','$2b$10$xttWMZNEf2NQ92Vg/WWQJu6sCWSr2TeSEOl5/BYXxfgLeaT8wRwIW','admin','2025-06-24 22:53:45','2025-06-24 22:53:45'),(2,'Usuario Normal','user@rifli.com','$2b$10$WHJ7qJwqSYSpV7bWBKrbI.1TC2PM8PS0B152NBbMfC0eK9cChPOKG','user','2025-06-24 22:53:45','2025-06-24 22:53:45'),(3,'Simon','simon@rifli.com','$2b$10$jDULdqEoQldfAouguUB9Ze5h6ClfS0rVNPyR8UBh57.uJN1F6LtDO','user','2025-06-24 23:05:12','2025-06-24 23:05:12'),(4,'Buasim','buasim@test.com','$2b$10$9Aw0UV7UZZiqVImArkhor.uQ/7OUEV9FLk8mfH.CrhEOwa2tZu40a','user','2026-01-05 01:13:37','2026-01-05 01:13:37');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-05 19:06:06
