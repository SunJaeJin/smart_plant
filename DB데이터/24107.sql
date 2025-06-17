-- MariaDB dump 10.19  Distrib 10.11.6-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: db24107
-- ------------------------------------------------------
-- Server version	10.11.6-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AI_models`
--

DROP TABLE IF EXISTS `AI_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AI_models` (
  `model_ID` int(11) NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `training_date` date NOT NULL,
  `accuracy` decimal(5,2) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`model_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AI_models`
--

LOCK TABLES `AI_models` WRITE;
/*!40000 ALTER TABLE `AI_models` DISABLE KEYS */;
INSERT INTO `AI_models` VALUES
(1,'v0.1','2024-05-25',0.86,'최초 테스트'),
(2,'v0.2','2024-05-25',0.93,'0.2 테스트'),
(3,'v0.3','2024-05-27',0.99,'3rd model'),
(5,'v0.4','2024-05-27',0.76,'4th model'),
(6,'v0.5','2024-05-27',0.76,'5th model'),
(7,'v0.6','2024-05-27',0.81,'6th model'),
(8,'v0.7','2024-05-27',0.82,'7th model'),
(9,'v0.8','2024-05-27',0.76,'8th model'),
(10,'v0.9','2024-05-27',0.85,'9th model'),
(11,'v1.0','2024-05-27',0.87,'10th model'),
(12,'v1.1','2024-05-27',0.87,'11th model'),
(13,'v1.2','2024-05-27',0.88,'12th model'),
(14,'v1.3','2024-05-27',0.90,'13th model'),
(15,'v1.4','2024-05-27',0.90,'14th model'),
(16,'v1.5','2024-05-27',0.91,'15th model'),
(17,'v1.6','2024-05-27',0.91,'16th model'),
(18,'v1.7','2024-05-27',0.93,'17th model'),
(19,'v1.8','2024-05-27',0.88,'18th model'),
(20,'v1.9','2024-05-28',0.98,'19th model');
/*!40000 ALTER TABLE `AI_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ActuatorLogs`
--

DROP TABLE IF EXISTS `ActuatorLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ActuatorLogs` (
  `log_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `actuator_type` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `log_timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`log_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `ActuatorLogs_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=336 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActuatorLogs`
--

LOCK TABLES `ActuatorLogs` WRITE;
/*!40000 ALTER TABLE `ActuatorLogs` DISABLE KEYS */;
INSERT INTO `ActuatorLogs` VALUES
(306,'test123','Led','LedOn: Auto','2024-05-31 18:36:04'),
(307,'test123','Fan','FanOn:humi_high','2024-05-31 18:36:10'),
(308,'test123','Fan','FanOff:humi_normal','2024-05-31 18:36:14'),
(309,'test123','Fan','FanOn:temp_high','2024-05-31 18:40:10'),
(310,'test123','Pump','PumpOn:manual','2024-05-31 18:42:52'),
(311,'test123','Led','LedOn: Auto','2024-05-31 18:42:54'),
(312,'test123','Led','LedOn: Auto','2024-06-06 21:16:35'),
(313,'test123','Fan','FanOn:temp_high','2024-06-06 21:16:41'),
(314,'test123','Pump','PumpOn:manual','2024-06-06 21:24:45'),
(315,'test123','Led','LedOn: Auto','2024-06-06 21:25:57'),
(316,'test123','Fan','FanOn:temp_high','2024-06-06 21:25:58'),
(317,'test123','Led','LedOn: Auto','2024-06-07 16:40:26'),
(318,'test123','Fan','FanOn:humi_high','2024-06-07 16:40:50'),
(319,'test123','Led','LedOn: Auto','2024-06-07 16:50:26'),
(320,'test123','Led','LedOn: Auto','2024-06-07 16:52:29'),
(321,'test123','Led','LedOn: Auto','2024-06-07 16:53:57'),
(322,'test123','Fan','FanOn:humi_high','2024-06-07 16:54:03'),
(323,'test123','Led','LedOn: Auto','2024-06-07 17:16:15'),
(324,'test123','Fan','FanOn:humi_high','2024-06-07 17:16:21'),
(325,'test123','Fan','FanOff:humi_normal','2024-06-07 17:16:54'),
(326,'test123','Fan','FanOn:humi_high','2024-06-07 17:21:13'),
(327,'test123','Fan','FanOff:humi_normal','2024-06-07 17:21:24'),
(328,'test123','Fan','FanOn:humi_high','2024-06-07 17:24:34'),
(329,'test123','Fan','FanOff:humi_normal','2024-06-07 17:24:44'),
(330,'test123','Fan','FanOn:humi_high','2024-06-07 17:27:44'),
(331,'test123','Fan','FanOff:humi_normal','2024-06-07 17:27:54'),
(332,'test123','Fan','FanOn:humi_high','2024-06-07 17:30:54'),
(333,'test123','Fan','FanOff:humi_normal','2024-06-07 17:31:04'),
(334,'test123','Pump','PumpOn:manual','2024-06-07 17:31:34'),
(335,'test123','Led','LedOn: Auto','2024-06-07 17:31:55');
/*!40000 ALTER TABLE `ActuatorLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admins` (
  `admin_ID` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES
('plantadmin24107','$2b$10$R.qgKA3JWb5mPx8..bRMQeLLmkBCkZK2ffYTWhRPMaR/G5V5uIpYi','자연지능화분관리자');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Alerts`
--

DROP TABLE IF EXISTS `Alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alerts` (
  `alert_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `read_status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`alert_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `Alerts_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alerts`
--

LOCK TABLES `Alerts` WRITE;
/*!40000 ALTER TABLE `Alerts` DISABLE KEYS */;
INSERT INTO `Alerts` VALUES
(44,'test123','Pump','급수 모듈이 작동하였습니다.','2024-05-31 18:22:17',0),
(45,'test123','Pump','급수 모듈이 작동하였습니다.','2024-05-31 18:33:13',0),
(46,'test123','Pump','급수 모듈이 작동하였습니다.','2024-05-31 18:42:52',0),
(47,'test123','Pump','급수 모듈이 작동하였습니다.','2024-06-06 21:24:45',0),
(48,'test123','Pump','급수 모듈이 작동하였습니다.','2024-06-07 17:31:34',0);
/*!40000 ALTER TABLE `Alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DeviceAutoSettings`
--

DROP TABLE IF EXISTS `DeviceAutoSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeviceAutoSettings` (
  `setting_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `temp_range` varchar(50) DEFAULT NULL,
  `humidity_range` varchar(50) DEFAULT NULL,
  `light_intensity` varchar(50) DEFAULT NULL,
  `watering_interval` varchar(50) DEFAULT NULL,
  `led_on_time` time DEFAULT NULL,
  `led_off_time` time DEFAULT NULL,
  PRIMARY KEY (`setting_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `DeviceAutoSettings_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DeviceAutoSettings`
--

LOCK TABLES `DeviceAutoSettings` WRITE;
/*!40000 ALTER TABLE `DeviceAutoSettings` DISABLE KEYS */;
INSERT INTO `DeviceAutoSettings` VALUES
(1,'kaleidoscopic4703','24-49','34-59','106','3 days','01:48:16','23:34:05'),
(2,'upset6211','21-40','32-49','394','3 days','08:51:09','00:40:29'),
(3,'probable5873','18-42','33-44','210','7 days','18:58:29','07:07:55'),
(4,'angelic8035','22-47','21-53','463','7 days','16:06:02','15:36:02'),
(5,'sneaky2518','15-47','32-46','313','7 days','09:45:42','16:41:38'),
(6,'entire3641','20-45','32-60','298','1 days','05:51:30','17:17:13'),
(7,'beautiful7070','18-43','21-50','282','2 days','05:46:01','18:33:49'),
(8,'educated5698','18-45','33-56','364','5 days','20:50:48','05:41:38'),
(9,'fearless9298','17-35','21-58','433','1 days','03:41:58','14:08:04'),
(10,'alive8574','28-37','32-47','297','2 days','01:41:43','00:36:29'),
(11,'firsthand7540','11-44','35-45','368','5 days','07:31:55','19:57:39'),
(12,'near1302','26-49','29-59','140','6 days','23:31:11','23:11:47'),
(13,'stormy3871','19-41','34-55','413','7 days','14:38:29','02:16:30'),
(14,'merry4427','13-35','22-50','200','3 days','09:16:33','15:25:07'),
(15,'rusty0405','11-31','25-41','322','5 days','00:50:36','21:28:19'),
(16,'nutritious2447','27-31','20-53','168','1 days','03:14:55','19:49:44'),
(17,'unused7744','26-49','35-45','477','1 days','07:22:55','07:36:36'),
(18,'candid7291','29-32','31-55','306','3 days','01:04:39','17:32:44'),
(19,'ancient1080','12-43','37-58','426','7 days','15:09:15','03:16:25'),
(20,'drafty9173','23-43','23-53','304','2 days','02:47:28','05:22:18'),
(21,'partial1633','21-47','27-42','162','2 days','19:44:04','01:12:11'),
(22,'knobby4353','15-44','34-51','202','1 days','23:35:05','15:03:27'),
(23,'aware3431','19-41','35-43','376','4 days','02:52:40','22:26:11'),
(24,'able4459','23-31','36-42','408','6 days','13:27:14','17:07:23'),
(25,'young7335','28-50','37-51','337','2 days','22:02:24','05:09:47'),
(26,'valid2242','10-45','35-58','369','5 days','02:37:12','15:04:07'),
(27,'neat9295','27-31','35-60','393','6 days','20:57:30','10:58:57'),
(28,'pointed3096','11-40','36-56','185','6 days','10:18:20','02:47:16'),
(29,'authentic5016','16-43','34-58','182','5 days','23:00:00','17:39:15'),
(44,'test123','21-25°C','40-70%','Medium','Bi-weekly',NULL,NULL);
/*!40000 ALTER TABLE `DeviceAutoSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Device_photos`
--

DROP TABLE IF EXISTS `Device_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Device_photos` (
  `photo_ID` int(11) NOT NULL AUTO_INCREMENT,
  `mac` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `ai_result` varchar(255) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `error_log` text DEFAULT NULL,
  `user_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`photo_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `Device_photos_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Device_photos`
--

LOCK TABLES `Device_photos` WRITE;
/*!40000 ALTER TABLE `Device_photos` DISABLE KEYS */;
INSERT INTO `Device_photos` VALUES
(1,'35:1e:1c:4e:a9:ff','https://loremflickr.com/640/480','수박페페로미아','2024-05-24 20:38:01','Solitudo virgo texo.','kaleidoscopic4703'),
(2,'e3:1c:07:30:67:c3','https://loremflickr.com/640/480','아글라오네마','2024-05-24 20:21:30','Alveus artificiose tunc alienus sono adeo laborum casso ullus blandior.','upset6211'),
(3,'1c:01:75:1f:a9:bb','https://loremflickr.com/640/480','아프리칸 바이올렛','2024-05-24 02:05:09','Timidus pauci creptio xiphias sodalitas ulciscor depopulo volva tollo.','probable5873'),
(4,'9f:29:e9:2f:1b:32','https://loremflickr.com/640/480','칼라데아','2024-05-24 18:00:18','Defessus crebro ventosus.','angelic8035'),
(5,'72:a3:0d:ba:56:a4','https://loremflickr.com/640/480','필로덴드론','2024-05-24 15:16:51','Deprecator incidunt nemo adulescens depopulo bardus patruus corpus minus cerno.','sneaky2518'),
(6,'77:c4:c4:b2:dd:ef','https://loremflickr.com/640/480','검은눈천인국','2024-05-24 01:56:26','Ocer vos apostolus hic angelus.','entire3641'),
(7,'84:5e:e1:09:63:9b','https://loremflickr.com/640/480','시클라멘','2024-05-24 15:57:59','Sub adulescens eius carpo absorbeo suasoria condico.','beautiful7070'),
(8,'01:9e:65:30:bb:9e','https://loremflickr.com/640/480','더피고사리','2024-05-24 06:47:32','Cogo et voluntarius somniculosus pariatur timor amoveo spiritus laboriosam denique.','educated5698'),
(9,'9b:da:be:e6:c7:42','https://loremflickr.com/640/480','숙근이베리스','2024-05-24 14:27:38','Amoveo solitudo averto aestivus.','fearless9298'),
(10,'e4:44:7a:63:27:89','https://loremflickr.com/640/480','더피고사리','2024-05-24 16:46:41','Confugo adversus celo tantillus vestigium agnitio adipiscor.','alive8574'),
(11,'08:20:c4:52:e0:45','https://loremflickr.com/640/480','아스피디스트라','2024-05-24 02:31:20','Custodia conspergo spiculum coadunatio delicate dedico succurro at dens.','firsthand7540'),
(12,'bf:ae:c8:d2:9a:6a','https://loremflickr.com/640/480','제라늄','2024-05-24 21:57:19','Ars demergo maiores cubitum thesaurus quasi cicuta.','near1302'),
(13,'49:d0:1a:18:99:54','https://loremflickr.com/640/480','접란','2024-05-24 09:29:20','Demo cito cibo trucido totus depereo fugiat venustas verbum civis.','stormy3871'),
(14,'56:93:5e:77:72:c5','https://loremflickr.com/640/480','관음죽','2024-05-24 16:21:12','Sub tumultus adulescens bibo theca varius aut agnitio corrupti.','merry4427'),
(15,'a3:18:8f:a6:88:91','https://loremflickr.com/640/480','검은눈천인국','2024-05-24 06:41:54','Vulpes tantillus arbustum viriliter.','rusty0405'),
(16,'73:ec:00:a5:fe:8c','https://loremflickr.com/640/480','데이지','2024-05-24 17:42:17','Vinco amiculum nostrum quaerat soleo canto.','nutritious2447'),
(17,'0c:37:19:4d:f2:76','https://loremflickr.com/640/480','필로덴드론','2024-05-24 16:45:40','Balbus vacuus corrumpo timor.','unused7744'),
(18,'11:f4:68:48:5f:02','https://loremflickr.com/640/480','더피고사리','2024-05-24 09:56:13','Corporis ustulo aegrus.','candid7291'),
(19,'34:60:36:09:ac:66','https://loremflickr.com/640/480','팻츠헤데라','2024-05-24 23:21:25','Censura explicabo depraedor ultio vos.','ancient1080'),
(20,'1a:70:d1:e7:93:1b','https://loremflickr.com/640/480','스파티필룸','2024-05-24 22:58:13','Vitium vereor adfero studio.','drafty9173'),
(21,'5b:61:7f:1e:c5:ef','https://loremflickr.com/640/480','히포에스테스','2024-05-24 14:41:13','Debeo velociter alius rerum amo sophismata avaritia strues.','partial1633'),
(22,'93:df:dd:5d:61:06','https://loremflickr.com/640/480','장미','2024-05-25 00:06:49','Nostrum rem conventus argentum tutamen studio.','knobby4353'),
(23,'c9:40:d6:36:a5:13','https://loremflickr.com/640/480','접란','2024-05-24 11:53:10','Claudeo conturbo curso placeat traho callide vomica caute caterva ante.','aware3431'),
(24,'ab:77:8a:c4:87:8d','https://loremflickr.com/640/480','벤자민 고무나무','2024-05-24 09:30:01','Distinctio statim nihil curis adversus.','able4459'),
(25,'66:43:6b:b8:39:a6','https://loremflickr.com/640/480','더피고사리','2024-05-24 16:54:36','Careo amita iure.','young7335'),
(26,'8d:09:84:e8:01:cc','https://loremflickr.com/640/480','프테리스','2024-05-24 10:06:49','Vomer cibo vae nam.','valid2242'),
(27,'05:be:b9:d1:34:ac','https://loremflickr.com/640/480','관음죽','2024-05-24 06:38:44','Cur crapula voluptatibus.','neat9295'),
(28,'e8:d6:e1:6b:c1:0d','https://loremflickr.com/640/480','접란','2024-05-24 03:03:01','Beneficium sui sponte.','pointed3096'),
(29,'99:d3:6e:e7:bd:cb','https://loremflickr.com/640/480','금전수','2024-05-24 06:56:41','Aggero carpo uxor campana natus perferendis valetudo debitis.','authentic5016'),
(61,'D8:3A:DD:1E:AB:24','/home/t24107/v1.0src/backend/uploads/1717148149650-plant.jpg','산세베리아','2024-05-31 09:35:56',NULL,'test123');
/*!40000 ALTER TABLE `Device_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Devices`
--

DROP TABLE IF EXISTS `Devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Devices` (
  `device_ID` int(11) NOT NULL AUTO_INCREMENT,
  `mac` varchar(255) NOT NULL,
  `user_ID` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`device_ID`),
  UNIQUE KEY `mac` (`mac`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `Devices_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Devices`
--

LOCK TABLES `Devices` WRITE;
/*!40000 ALTER TABLE `Devices` DISABLE KEYS */;
INSERT INTO `Devices` VALUES
(1,'35:1e:1c:4e:a9:ff','kaleidoscopic4703','Device1','Info about Device1'),
(2,'e3:1c:07:30:67:c3','upset6211','Device2','Info about Device2'),
(3,'1c:01:75:1f:a9:bb','probable5873','Device3','Info about Device3'),
(4,'9f:29:e9:2f:1b:32','angelic8035','Device4','Info about Device4'),
(5,'72:a3:0d:ba:56:a4','sneaky2518','Device5','Info about Device5'),
(6,'77:c4:c4:b2:dd:ef','entire3641','Device6','Info about Device6'),
(7,'84:5e:e1:09:63:9b','beautiful7070','Device7','Info about Device7'),
(8,'01:9e:65:30:bb:9e','educated5698','Device8','Info about Device8'),
(9,'9b:da:be:e6:c7:42','fearless9298','Device9','Info about Device9'),
(10,'e4:44:7a:63:27:89','alive8574','Device10','Info about Device10'),
(11,'08:20:c4:52:e0:45','firsthand7540','Device11','Info about Device11'),
(12,'bf:ae:c8:d2:9a:6a','near1302','Device12','Info about Device12'),
(13,'49:d0:1a:18:99:54','stormy3871','Device13','Info about Device13'),
(14,'56:93:5e:77:72:c5','merry4427','Device14','Info about Device14'),
(15,'a3:18:8f:a6:88:91','rusty0405','Device15','Info about Device15'),
(16,'73:ec:00:a5:fe:8c','nutritious2447','Device16','Info about Device16'),
(17,'0c:37:19:4d:f2:76','unused7744','Device17','Info about Device17'),
(18,'11:f4:68:48:5f:02','candid7291','Device18','Info about Device18'),
(19,'34:60:36:09:ac:66','ancient1080','Device19','Info about Device19'),
(20,'1a:70:d1:e7:93:1b','drafty9173','Device20','Info about Device20'),
(21,'5b:61:7f:1e:c5:ef','partial1633','Device21','Info about Device21'),
(22,'93:df:dd:5d:61:06','knobby4353','Device22','Info about Device22'),
(23,'c9:40:d6:36:a5:13','aware3431','Device23','Info about Device23'),
(24,'ab:77:8a:c4:87:8d','able4459','Device24','Info about Device24'),
(25,'66:43:6b:b8:39:a6','young7335','Device25','Info about Device25'),
(26,'8d:09:84:e8:01:cc','valid2242','Device26','Info about Device26'),
(27,'05:be:b9:d1:34:ac','neat9295','Device27','Info about Device27'),
(28,'e8:d6:e1:6b:c1:0d','pointed3096','Device28','Info about Device28'),
(29,'99:d3:6e:e7:bd:cb','authentic5016','Device29','Info about Device29'),
(44,'D8:3A:DD:1E:AB:24','test123','SMARTPOT','SMART_POT_S_Ver0.5');
/*!40000 ALTER TABLE `Devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inquiries`
--

DROP TABLE IF EXISTS `Inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Inquiries` (
  `inquiry_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`inquiry_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `Inquiries_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inquiries`
--

LOCK TABLES `Inquiries` WRITE;
/*!40000 ALTER TABLE `Inquiries` DISABLE KEYS */;
INSERT INTO `Inquiries` VALUES
(1,'test123','2024-05-28 15:11:42','문의 드립니다','문의 드립니다','answered'),
(2,'test123','2024-05-28 15:18:06','AIOT 스마트 화단 시스템 오류 관련 문의','안녕하세요. 최근 설치한 AIOT 스마트 화단 시스템에서 물 공급이 제대로 이루어지지 않는 것 같습니다. 설정은 모두 정상적으로 확인했는데, 어떤 문제인지 파악하고 싶습니다.','pending'),
(3,'test123','2024-05-28 15:18:38','스마트 화단 관리 앱 연동 문제 해결 요청','스마트 화단 관리 앱과 AIOT 시스템의 연동이 갑자기 끊겼습니다. 앱을 삭제 후 재설치해도 동일한 문제가 발생하는데, 해결 방법을 알고 싶습니다.','pending'),
(4,'test123','2024-05-28 15:19:08','AIOT 스마트 화단의 온도 조절 기능 문의','안녕하세요. 스마트 화단에서 온도 조절 기능을 사용하고 싶은데, 설정 방법을 찾을 수 없습니다. 자세한 사용 방법을 안내해주시면 감사하겠습니다.','pending'),
(5,'test123','2024-05-28 15:19:42','식물 성장 데이터 분석 요청','AIOT 스마트 화단 시스템을 사용하면서 식물의 성장 데이터를 수집하고 있습니다. 이 데이터를 분석하여 식물의 성장 상태를 더 잘 이해하고 싶은데, 어떻게 하면 좋을까요?','pending'),
(6,'test123','2024-05-27 09:19:52','Admoveo causa voluptatem.','Vulgo sulum odio celebrer barba suscipio. Absorbeo expedita tristis tyrannus atavus collum vorax. Aggero universe curso quas.','pending'),
(7,'kaleidoscopic4703','2024-05-27 19:15:57','Varietas unde coniuratio thymum absque patruus stella spiculum corrigo.','Autem tamen unde. Vita quo creator rem deduco adamo sufficio deduco adinventitias. Triduana unde incidunt derelinquo praesentium verbera derideo sordeo accusator.','pending'),
(8,'upset6211','2024-05-28 06:09:55','Caelestis calamitas argentum.','Subseco teneo terror commemoro temptatio arbitro assentator. Altus odit validus. Aegre canonicus charisma et bis decumbo curatio.','pending'),
(9,'probable5873','2024-05-28 05:29:04','Suffoco corrupti colligo contabesco caveo verbera summisse absum quo vigilo.','Vulgivagus iste venio socius dapifer. Similique aperiam audacia cuius tricesimus deficio copia accusator super. Nam corpus depromo thermae.','pending'),
(10,'angelic8035','2024-05-27 17:46:09','Decretum caterva cicuta degusto tersus demens demum adulatio terra.','Tibi ascit bardus pel adduco. Certe venia veritas curatio curvo. Cotidie arx crepusculum iure certus.','pending'),
(11,'sneaky2518','2024-05-27 20:58:27','Tergeo inflammatio verbera.','Coniecto crustulum acsi speculum decor damno vitae. Cibo subvenio tui angelus. Conatus vulgo acquiro vereor hic via deleo cunae.','pending'),
(12,'entire3641','2024-05-27 09:16:20','Angustus cognomen et provident a vilitas.','Decretum tergeo arto vinitor. Verus complectus ager. Explicabo tum solitudo collum audax abutor antepono colo.','pending'),
(13,'beautiful7070','2024-05-27 11:06:51','Perferendis tergum vicinus vereor.','Minus natus bonus amaritudo provident thesaurus carcer. Vigilo argentum adstringo alioqui aegre adsum apto. Illum alter allatus tego certe substantia.','pending'),
(14,'educated5698','2024-05-28 04:47:21','Tabesco tumultus trepide voluntarius debilito ventito.','Tamquam nihil veritatis terror decimus pectus capio dedico. Canis contigo cariosus stillicidium adicio colo officiis combibo caute alo. Vis amaritudo vindico nihil turba stella sulum ventus.','pending'),
(15,'fearless9298','2024-05-27 22:12:34','Confido carus alii coniecto vehemens molestiae amplexus adimpleo supra barba.','Ager vitiosus tum accusator sophismata solitudo. Apostolus dolorem vorax textilis tenax paulatim in. Repellat crebro volaticus ancilla tot.','pending'),
(16,'alive8574','2024-05-27 18:17:00','Censura cura tersus coniuratio.','Terra adsidue spiritus cometes provident cubicularis. Tamdiu atrocitas arto deserunt curriculum similique. Acsi verus ater talio solutio ustulo.','pending'),
(17,'firsthand7540','2024-05-27 21:57:16','Calcar thalassinus alo inventore.','Cognatus apparatus virtus audentia degero valde tardus verus. Esse denego concido culpa desolo comparo. Carus tabula amor demonstro tollo exercitationem commodi.','pending'),
(18,'near1302','2024-05-27 13:11:38','Sol ambitus inventore comptus.','Nostrum decerno cibo tres excepturi coadunatio. Complectus vulariter aliquam nihil eveniet cattus. Creator tunc voluntarius voveo vorax caste artificiose.','pending'),
(19,'stormy3871','2024-05-27 10:15:56','Atrox suus velut quos strues audax suus voluptatibus amitto consequuntur.','Illum damnatio valeo strenuus volo. Civis curis conforto caries studio arto curis. Aeternus vae crastinus quidem tenetur stella assentator viscus.','pending'),
(20,'merry4427','2024-05-28 05:08:18','Tricesimus xiphias volup tener tabesco decipio defungo universe attonbitus tum.','Desino amoveo vere suscipit coadunatio crinis corona vulgo contra claustrum. Cinis ulterius aggredior auctus necessitatibus vomito incidunt utrum sollicito. Curto tonsor coma qui centum cupiditate.','pending'),
(21,'rusty0405','2024-05-28 02:16:12','Bene damnatio colligo vaco aspernatur una defleo tametsi omnis.','Texo admitto tabella dedecor voluptas ars anser vel tardus adimpleo. Usus vulariter ait utique aranea adduco. Repudiandae eaque verbera dolores ancilla barba ademptio cultellus eligendi pax.','pending'),
(22,'nutritious2447','2024-05-28 05:34:34','Considero patruus deprimo turba vigilo admoveo adimpleo.','Tam maxime colligo minus somniculosus valde vinculum aestivus synagoga cruentus. Distinctio alius socius cunctatio fugiat natus derideo libero comburo. Utor apud subiungo corporis sumptus textus deleo accommodo articulus velociter.','pending'),
(23,'unused7744','2024-05-27 19:40:32','Tenax eum quam sapiente alter textilis demoror bibo vado vicinus.','Ulterius caecus deleniti omnis conor. Pauci ustilo varius magni cado auxilium cuius. Usitas tempore atqui.','pending'),
(24,'candid7291','2024-05-27 13:08:19','Temptatio pecco vulgaris thesaurus.','Corpus usque acer ater celebrer architecto crastinus xiphias nesciunt sollers. Maxime ustilo defendo abduco cicuta speciosus suppono vestigium amita. Spargo tot cresco cursus cognomen.','pending'),
(25,'ancient1080','2024-05-27 08:31:17','Cruciamentum corroboro autus laboriosam viduo volva apparatus caveo versus laudantium.','Vestigium demonstro talus laborum adopto synagoga conqueror velociter. Tergeo arbor adimpleo cibus candidus somnus denique velociter soluta suscipit. Voluptatibus viridis ipsa aperiam spes.','pending'),
(26,'drafty9173','2024-05-28 05:09:16','Eos terra antepono.','Deporto deorsum aqua. Error adipiscor auctus. Cultura tonsor aurum caries vis volva curiositas confero templum.','pending'),
(27,'partial1633','2024-05-27 10:59:46','Cohaero animadverto utrimque vorax natus vulgivagus coniuratio.','Vulgus adulatio cotidie unde absorbeo ait debeo deduco. Accusator in adhuc coniecto animadverto expedita bibo somnus. Vinum voro porro.','pending'),
(28,'knobby4353','2024-05-27 12:56:52','Audeo admoveo constans videlicet avaritia casso arbitro theca degero triduana.','Spiculum libero ullus eos adiuvo. Somniculosus sum adipisci. Denuncio territo color derelinquo.','pending'),
(29,'aware3431','2024-05-27 21:54:25','Ab appono assumenda comitatus tactus auctor victus.','Tamquam abscido comes anser velut patrocinor. Audentia iure caput pariatur aureus correptius. Bardus circumvenio conforto verumtamen.','pending'),
(30,'able4459','2024-05-27 09:56:29','Ambitus est demum qui creptio tabula velut suppono aperiam.','Color demo ago tertius. Voluptate astrum assentator acidus advenio voluntarius. Adopto aestas tibi.','pending'),
(31,'young7335','2024-05-27 09:58:38','Tripudio contabesco valeo claudeo delicate minima alo.','Argumentum deprimo undique voveo. Attero commodi iusto utor corporis verbum. Creator ubi subseco pectus decretum assentator adeptio comptus ullus articulus.','pending'),
(32,'valid2242','2024-05-27 13:46:21','Repellat carbo deorsum copiose quae clarus ars hic.','Absens aveho calcar deduco adopto cupiditate taedium cogo. Abbas veniam occaecati auditor. Celer desparatus sponte torrens.','pending'),
(33,'neat9295','2024-05-27 19:32:55','Cetera sublime acerbitas summa turbo theca sursum decipio.','Vestrum vicissitudo distinctio tui admiratio tristis defetiscor bestia decor pecto. Adnuo tantum turbo labore acer credo. Turba claro currus.','pending'),
(34,'pointed3096','2024-05-28 00:52:35','Angulus usus deorsum angelus.','Clementia ullus error conscendo defendo curto depraedor tui voveo aperte. Conicio adinventitias tremo. Vergo ara adduco quo solium textilis creo.','pending'),
(35,'authentic5016','2024-05-27 13:00:51','Sulum paens talis esse attollo comminor tot timor confero conicio.','Tui verus depono contra carbo defendo sublime suscipio casso. Vergo vulgaris clarus vulgus aliqua textus tempore vorax synagoga. Antepono aspicio trepide deprecator.','pending'),
(36,'test123','2024-05-27 19:07:29','무죄로 평생교육을 증거인멸의 사생활의 국가는 계승·발전과 법률로 창달에.','신체의 승인된 무상으로. 기능을 거듭 한다. 다만, 3년 일반적으로 3년 침해받지. 시설기준과 국민은 법률이 국내법과 범죄에 3년 범하고 또는.','answered'),
(37,'kaleidoscopic4703','2024-05-27 11:26:43','침해받지 거듭 국가는 아니한다. 저작자·발명가·과학기술자와 아니하는 아니한다. 수.','거듭 비밀과 추정된다. 의무교육은 판결이 기능을 일반적으로. 아니한다. 필요한 의무를 증거인멸의 행위로. 때에는 죄를 범하고.','answered'),
(38,'upset6211','2024-05-27 09:37:38','거듭 아니하는 대하여 형에 사항은 현행범인인 거듭 한다..','예술가의 대하여 통신·방송의 판결이 무상으로 통신·방송의 해당하는 현행범인인 죄를. 다만, 헌법에 구성하지 있다. 보호를 장기 추정된다. 때까지는 무죄로 시설기준과. 저작자·발명가·과학기술자와 정하는 사생활의 처벌받지 민족문화의 동일한.','answered'),
(39,'probable5873','2024-05-28 05:47:46','국제법규는 거듭 한다. 증거인멸의 염려가.','국내법과 국민은 정하는 가진다. 형에. 권리는 청구할 자유를 헌법에 범죄에 유죄의. 같은 현행범인인 청구할 행위로 정하는 추정된다. 전통문화의.','answered'),
(40,'angelic8035','2024-05-27 10:30:52','국내법과 이상의 기능을 모성의 평생교육을 3년.','승인된 다만, 비밀과 국내법과 행위로 동일한 의하여 모성의 증거인멸의. 범하고 의무를 비밀과 염려가 범죄를 권리는. 아니하는 경우와 사항은.','answered'),
(41,'sneaky2518','2024-05-27 17:22:48','예술가의 해당하는 보장하기.','판결이 아니하는 행위로 법률로. 판결이 형사피고인은 국내법과 국내법과 사항은. 의무교육은 있다. 모성의 침해받지 증거인멸의 의무교육은.','answered'),
(42,'entire3641','2024-05-27 10:10:20','거듭 법률이 전통문화의 보호할 위하여 국제법규는 기능을.','있을 자유를 신체의. 정한다. 시설기준과 법률로 기능을 아니하는 아니하며,. 법률로 사후에 대하여 전통문화의 노력하여야.','answered'),
(43,'beautiful7070','2024-05-27 16:38:17','일반적으로 정한다. 대하여 범죄에 위하여 행위시의 소추되지 모든 모든.','법률로 증거인멸의 경우와 다만, 국가는 재외국민을 비밀과. 또는 행위시의 추정된다. 위하여 권리는 통신·방송의 사항은 필요한. 장기 형사피고인은 바에.','answered'),
(44,'educated5698','2024-05-27 19:51:08','국민은 형에 전통문화의 행위로 조약과 저작자·발명가·과학기술자와 체결·공포된 침해받지.','추정된다. 신체의 필요한 있다. 있다. 증거인멸의 사후에 가진다. 보호를 보호할. 평생교육을 사생활의 법률이 해당하는. 의하여 보호할 수 행위시의 보호를 경우와 계승·발전과 승인된 또는 일반적으로.','answered'),
(45,'fearless9298','2024-05-27 17:01:27','조약과 침해받지 형에 보호를 보장하기 구성하지 위하여.','아니한다. 국제법규는 헌법에. 도피 보호를 범죄를 처벌받지 국제법규는 형에 염려가 기능을. 가진다. 동일한 위하여 도피 법률로 경우와 형사피고인은.','answered'),
(46,'alive8574','2024-05-27 07:42:06','범죄에 행위로 일반적으로 민족문화의 국내법과 의무교육은.','시설기준과 거듭 법률이 침해받지 의하여 또는 확정될 전통문화의. 전통문화의 예술가의 다만, 확정될. 거듭 3년 사항은 바에 유죄의 법률로 비밀과.','answered'),
(47,'firsthand7540','2024-05-27 13:13:45','기능을 평생교육을 같은 도피 판결이 해당하는 아니하는 모든 국가는 정한다..','사생활의 법률로 죄를 형사피고인은 민족문화의 보장하기 필요한. 범죄를 법률로 해당하는. 보호를 모든 예술가의 모든 예술가의.','answered'),
(48,'near1302','2024-05-27 06:41:17','사항은 행위로 신문의 도피 다만, 모든 범하고 같은 행위로.','모성의 대하여 사후에 범하고 소추되지. 유죄의 모성의 사후에 처벌받지 보호할 동일한 또는. 3년 형사피고인은 범하고 국제법규는 청구할.','answered'),
(49,'stormy3871','2024-05-27 11:53:44','동일한 침해받지 재외국민을 보호할 일반적으로 의무를 대하여 진다. 창달에.','평생교육을 행위로 형사피고인은 모성의 통신·방송의 계승·발전과 위하여. 모성의 형사피고인은 의무교육은. 법률이 유죄의 국민은 사생활의 비밀과 죄를.','answered'),
(50,'merry4427','2024-05-28 02:04:31','아니하며, 추정된다. 이상의 사후에 일반적으로 사항은.','증거인멸의 아니하는 판결이 염려가 아니한다. 증거인멸의 정한다. 형에 보호를. 자유를 형에 범죄에. 있다. 사항은 형사피고인은 의무교육은 동일한.','answered'),
(51,'rusty0405','2024-05-27 23:08:28','권리는 또는 노력하여야 체결·공포된 헌법에 범죄에 증거인멸의 보호한다. 동일한.','노력하여야 행위로 재외국민을 모든 사후에 평생교육을 사생활의 침해받지 사후에 예술가의. 추정된다. 같은 청구할 범죄에. 모든 의무교육은 범죄에 재외국민을 다만, 국민은 시설기준과 저작자·발명가·과학기술자와 아니한다..','answered'),
(52,'nutritious2447','2024-05-27 22:17:54','범죄에 바에 국제법규는 국민은 모든 신체의 진흥하여야 진다..','청구할 행위시의 한다. 예술가의 동일한 범죄를 이상의 같은 예술가의 진다.. 유죄의 의무교육은 의하여. 도피 3년 형사피고인은 있다. 전통문화의 증거인멸의 법률로 유죄의 국내법과.','answered'),
(53,'unused7744','2024-05-27 12:24:22','신문의 정하는 법률로.','승인된 보호를 모성의 경우와 신체의 도피 염려가. 국내법과 비밀과 구성하지 의무를 시설기준과 한다. 창달에 아니한다. 사생활의. 통신·방송의 있을 법률에 신문의 법률로 법률에 한다. 청구할 위하여.','answered'),
(54,'candid7291','2024-05-27 23:21:18','현행범인인 의무를 정하는 추정된다. 신체의 판결이 자유를 국제법규는 진흥하여야 신문의.','범하고 수 한다. 보장하기. 승인된 정한다. 판결이. 또는 형에 판결이 신문의 모든 이상의 행위로.','answered'),
(55,'ancient1080','2024-05-27 21:58:16','보장하기 비밀과 사항은 염려가 유죄의 국민은 사생활의 효력을 또는 같은.','유죄의 통신·방송의 유죄의 법률로 사생활의 조약과 저작자·발명가·과학기술자와 구성하지. 국제법규는 보호할 해당하는 기능을 신체의 아니하며,. 정한다. 경우와 사항은 영장을 조약과 전통문화의 계승·발전과.','answered'),
(56,'drafty9173','2024-05-27 16:32:20','국가는 국민은 의하여 행위시의 청구할.','민족문화의 평생교육을 신체의 신체의 증거인멸의 아니하며,. 자유를 유죄의 아니하며, 아니한다. 판결이 필요한. 법률로써 때까지는 무죄로 의하여 법률이 염려가.','answered'),
(57,'partial1633','2024-05-27 14:26:23','범하고 추정된다. 조약과 경우와 형에 정하는 유죄의 국내법과 기능을 국민은.','다만, 있을 청구할 가진다. 국제법규는 무상으로. 범죄에 진흥하여야 국가는. 형에 모든 재외국민을 비밀과 경우와 때까지는 계승·발전과.','answered'),
(58,'knobby4353','2024-05-27 16:39:42','헌법에 추정된다. 통신·방송의 바에 보장하기 구성하지.','창달에 영장을 바에 효력을 아니한다. 창달에. 처벌받지 법률로 헌법에 한다. 이상의 조약과 3년 무죄로. 모든 아니한다. 필요한 소추되지.','answered'),
(59,'aware3431','2024-05-27 10:48:53','죄를 통신·방송의 있다..','무죄로 증거인멸의 경우와 범죄를 구성하지 수 판결이 일반적으로 현행범인인. 증거인멸의 통신·방송의 현행범인인 일반적으로 도피 법률로 창달에 계승·발전과. 3년 아니하며, 대하여.','answered'),
(60,'able4459','2024-05-28 04:32:31','이상의 재외국민을 보호를 사생활의 증거인멸의 의무교육은 의하여 사항은.','법률이 효력을 의무교육은 죄를 있다. 전통문화의 국가는 증거인멸의 행위시의 행위시의. 바에 보호할 사후에 범죄를 아니한다.. 조약과 신문의 신문의 아니하는 있다. 다만, 비밀과 사생활의.','answered'),
(61,'young7335','2024-05-27 10:05:12','체결·공포된 재외국민을 의무교육은.','영장을 시설기준과 승인된 법률이 판결이 국가는 신체의 또는. 아니하는 비밀과 일반적으로 다만, 효력을. 기능을 사후에 도피 사항은 동일한 모든 승인된 청구할 신체의 창달에.','answered'),
(62,'valid2242','2024-05-27 08:56:47','재외국민을 대하여 행위로 무죄로 추정된다. 유죄의 국민은.','보호한다. 법률로써 범죄에 조약과 위하여 행위로 처벌받지 민족문화의 국민은 일반적으로. 때까지는 다만, 구성하지 효력을. 있다. 모성의 아니하는 범죄를 창달에 때에는 필요한.','answered'),
(63,'neat9295','2024-05-27 23:56:37','동일한 행위시의 모성의 사생활의 진흥하여야 계승·발전과 필요한 추정된다. 유죄의.','모든 행위시의 가진다. 범죄를 사생활의 무죄로 때에는. 예술가의 통신·방송의 처벌받지 같은 보장하기. 추정된다. 평생교육을 현행범인인 사후에 신문의 통신·방송의 신체의.','answered'),
(64,'pointed3096','2024-05-27 19:38:51','형에 의하여 법률로 평생교육을 모성의.','행위시의 가진다. 증거인멸의 국내법과 아니한다. 추정된다. 있다. 장기. 현행범인인 예술가의 평생교육을 죄를 체결·공포된 무죄로 승인된. 모든 청구할 법률로써 효력을 위하여.','answered'),
(65,'authentic5016','2024-05-27 22:03:23','처벌받지 무상으로 진다. 바에.','사생활의 추정된다. 있다. 아니하는 승인된. 통신·방송의 범죄에 정한다. 때까지는. 아니한다. 법률로써 동일한 보호할 국제법규는.','answered');
/*!40000 ALTER TABLE `Inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inquiry_replies`
--

DROP TABLE IF EXISTS `Inquiry_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Inquiry_replies` (
  `reply_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `admin_ID` varchar(255) DEFAULT NULL,
  `inquiry_ID` int(11) NOT NULL,
  `details` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`reply_ID`),
  KEY `inquiry_ID` (`inquiry_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `admin_ID` (`admin_ID`),
  CONSTRAINT `Inquiry_replies_ibfk_1` FOREIGN KEY (`inquiry_ID`) REFERENCES `Inquiries` (`inquiry_ID`),
  CONSTRAINT `Inquiry_replies_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`),
  CONSTRAINT `Inquiry_replies_ibfk_3` FOREIGN KEY (`admin_ID`) REFERENCES `Admins` (`admin_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inquiry_replies`
--

LOCK TABLES `Inquiry_replies` WRITE;
/*!40000 ALTER TABLE `Inquiry_replies` DISABLE KEYS */;
INSERT INTO `Inquiry_replies` VALUES
(2,'test123','plantadmin24107',36,'효력을 행위시의 범죄에 무죄로 정하는. 범하고 현행범인인 국민은 증거인멸의 시설기준과 기능을. 경우와 영장을 유죄의 보호를 구성하지 헌법에 형사피고인은 범죄를 진다..','2024-05-27 21:08:12'),
(3,'kaleidoscopic4703','plantadmin24107',37,'수 도피 계승·발전과 의무를. 전통문화의 범죄를 도피 있다.. 민족문화의 정한다. 진다. 범죄를 계승·발전과 처벌받지 있을 정한다..','2024-05-27 09:20:08'),
(4,'upset6211','plantadmin24107',38,'영장을 수 현행범인인 바에 유죄의 정하는 구성하지. 때에는 판결이 형에 법률에 권리는 바에. 계승·발전과 사항은 도피 구성하지 소추되지 동일한 계승·발전과 신문의.','2024-05-27 07:05:39'),
(5,'probable5873','plantadmin24107',39,'신문의 의하여 재외국민을 체결·공포된 침해받지. 창달에 사생활의 판결이 국민은 행위시의 창달에 염려가 범죄를. 법률에 다만, 체결·공포된 진흥하여야 확정될 국제법규는.','2024-05-27 17:27:24'),
(6,'angelic8035','plantadmin24107',40,'민족문화의 기능을 정하는 법률이 소추되지 형사피고인은 법률로 도피. 기능을 때까지는 동일한 무상으로 판결이. 진흥하여야 경우와 의무를 기능을 거듭 비밀과 신문의 형사피고인은 증거인멸의.','2024-05-28 00:45:00'),
(7,'sneaky2518','plantadmin24107',41,'위하여 바에 일반적으로 수 때까지는. 도피 도피 법률로 계승·발전과 이상의 확정될 법률에 장기. 필요한 때에는 다만,.','2024-05-27 12:16:03'),
(8,'entire3641','plantadmin24107',42,'의무교육은 효력을 추정된다. 또는 보호를 위하여 시설기준과 저작자·발명가·과학기술자와 가진다.. 범하고 해당하는 행위로 국민은 범하고 전통문화의 필요한 체결·공포된 보호한다.. 신체의 무죄로 거듭 필요한 효력을 때까지는.','2024-05-27 06:38:57'),
(9,'beautiful7070','plantadmin24107',43,'바에 보호할 의무를 국가는. 신문의 같은 아니하는 통신·방송의 사항은. 헌법에 국제법규는 사후에 침해받지 전통문화의 헌법에.','2024-05-28 06:20:47'),
(10,'educated5698','plantadmin24107',44,'정하는 한다. 정하는 통신·방송의 전통문화의 청구할. 아니하는 도피 기능을 가진다. 현행범인인 사후에 아니하는 범하고 국민은. 모든 침해받지 아니하는.','2024-05-28 04:19:44'),
(11,'fearless9298','plantadmin24107',45,'효력을 효력을 체결·공포된 헌법에 의하여 평생교육을 국제법규는 사생활의 범죄에 권리는. 현행범인인 행위로 사후에 창달에 범죄에 법률에 체결·공포된 범죄에 무죄로 행위시의. 모든 소추되지 아니한다. 있을 같은 범죄에 법률로.','2024-05-27 18:10:52'),
(12,'alive8574','plantadmin24107',46,'국제법규는 보호를 염려가 현행범인인 염려가 가진다. 헌법에. 한다. 현행범인인 무죄로 확정될 의무를 영장을 형에 조약과. 처벌받지 법률이 장기.','2024-05-27 23:54:18'),
(13,'firsthand7540','plantadmin24107',47,'모든 때에는 법률로써 아니하며, 범하고 이상의 또는 한다. 국제법규는. 조약과 저작자·발명가·과학기술자와 추정된다. 일반적으로 신체의. 법률이 소추되지 아니한다. 진다. 일반적으로 사후에 아니하며,.','2024-05-27 11:00:42'),
(14,'near1302','plantadmin24107',48,'죄를 한다. 시설기준과 때까지는. 처벌받지 보호할 아니하는 진다. 승인된 있다. 노력하여야. 필요한 자유를 의하여 아니한다. 때까지는 형에 법률에 판결이 장기.','2024-05-27 07:38:29'),
(15,'stormy3871','plantadmin24107',49,'경우와 가진다. 대하여. 죄를 유죄의 신문의 이상의 정한다.. 저작자·발명가·과학기술자와 국제법규는 거듭.','2024-05-28 05:06:42'),
(16,'merry4427','plantadmin24107',50,'계승·발전과 노력하여야 판결이 범죄를 예술가의 사후에 창달에. 침해받지 의하여 청구할 도피. 민족문화의 다만, 영장을 헌법에 통신·방송의 의무교육은 예술가의 범하고 국내법과 유죄의.','2024-05-27 17:48:59'),
(17,'rusty0405','plantadmin24107',51,'신문의 조약과 처벌받지 있다. 국제법규는 형에. 때까지는 효력을 아니하며, 형사피고인은 바에 침해받지 기능을 진흥하여야 민족문화의. 해당하는 아니한다. 가진다..','2024-05-27 18:06:04'),
(18,'nutritious2447','plantadmin24107',52,'저작자·발명가·과학기술자와 정한다. 판결이 신문의 행위로 도피 범죄를 동일한 장기. 정한다. 죄를 3년 유죄의 경우와 또는 이상의 다만, 민족문화의 영장을. 영장을 법률로 판결이 동일한 구성하지 모든 유죄의.','2024-05-28 05:52:58'),
(19,'unused7744','plantadmin24107',53,'저작자·발명가·과학기술자와 동일한 행위로 노력하여야 신체의 국내법과 저작자·발명가·과학기술자와 가진다. 범죄를. 모성의 진다. 정하는 행위시의 정하는 무상으로 계승·발전과. 통신·방송의 진다. 있을 때에는 정하는 가진다. 법률로.','2024-05-27 18:15:27'),
(20,'candid7291','plantadmin24107',54,'국제법규는 의무교육은 유죄의 죄를 수 아니하며, 경우와 일반적으로 영장을. 의무교육은 수 행위시의. 염려가 범죄를 헌법에 국가는 있을 때에는 예술가의 추정된다. 대하여.','2024-05-27 14:52:16'),
(21,'ancient1080','plantadmin24107',55,'계승·발전과 법률에 모성의 3년. 비밀과 증거인멸의 사항은 가진다.. 무죄로 보장하기 법률에.','2024-05-27 09:24:39'),
(22,'drafty9173','plantadmin24107',56,'창달에 아니하는 창달에 사항은 아니하며, 바에 한다. 사항은. 효력을 헌법에 있다. 아니하는 행위시의 도피 보호한다. 헌법에. 사후에 있을 청구할 형사피고인은 또는 현행범인인 무상으로 노력하여야 증거인멸의.','2024-05-28 06:00:51'),
(23,'partial1633','plantadmin24107',57,'예술가의 확정될 있을 무죄로. 노력하여야 조약과 국민은 저작자·발명가·과학기술자와 모성의 유죄의 확정될 침해받지. 재외국민을 형에 때까지는 처벌받지 법률로써 승인된 보장하기.','2024-05-27 09:05:07'),
(24,'knobby4353','plantadmin24107',58,'거듭 범죄에 다만, 해당하는 법률이 권리는 구성하지 전통문화의 진흥하여야. 영장을 모성의 승인된 효력을. 필요한 때에는 거듭 법률이.','2024-05-28 03:47:06'),
(25,'aware3431','plantadmin24107',59,'염려가 의하여 신체의 범죄에 민족문화의 행위로 재외국민을 있다. 범하고. 통신·방송의 위하여 도피 아니하며,. 장기 구성하지 같은 범하고 신문의 장기.','2024-05-27 23:02:57'),
(26,'able4459','plantadmin24107',60,'수 승인된 형사피고인은. 3년 대하여 형에 동일한 구성하지 권리는 의무교육은 의무교육은 있다.. 의하여 장기 법률에.','2024-05-27 08:24:53'),
(27,'young7335','plantadmin24107',61,'법률로 의무교육은 사후에 헌법에 아니한다. 아니하는 도피 승인된 비밀과 전통문화의. 신체의 모성의 민족문화의 장기 유죄의 국민은 한다. 아니한다.. 시설기준과 도피 소추되지 국내법과 사항은 일반적으로 예술가의.','2024-05-27 18:40:32'),
(28,'valid2242','plantadmin24107',62,'저작자·발명가·과학기술자와 모성의 아니하며, 저작자·발명가·과학기술자와. 염려가 조약과 가진다. 행위로 행위로. 사후에 도피 조약과 때까지는 때까지는 신체의.','2024-05-27 21:57:10'),
(29,'neat9295','plantadmin24107',63,'정한다. 범죄에 시설기준과 같은 보호를 유죄의 정한다. 아니한다. 장기 보호한다.. 진흥하여야 동일한 효력을. 증거인멸의 법률에 범죄를.','2024-05-28 01:33:37'),
(30,'pointed3096','plantadmin24107',64,'같은 일반적으로 범하고. 국민은 정한다. 범하고 조약과 사항은 다만,. 모든 범죄에 비밀과 형사피고인은 바에 의무교육은.','2024-05-28 02:35:48'),
(31,'authentic5016','plantadmin24107',65,'범하고 확정될 국내법과 때에는. 신문의 법률로 법률로써 유죄의 거듭 때에는 통신·방송의 추정된다. 형사피고인은 장기. 승인된 민족문화의 사후에 아니한다..','2024-05-28 04:22:09'),
(32,'test123','plantadmin24107',1,'문의 답변 드립니다.','2024-05-28 15:33:57');
/*!40000 ALTER TABLE `Inquiry_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ManualDeviceSettings`
--

DROP TABLE IF EXISTS `ManualDeviceSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ManualDeviceSettings` (
  `setting_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `device_type` varchar(255) NOT NULL,
  `state` varchar(10) NOT NULL,
  `intensity` int(11) DEFAULT NULL,
  PRIMARY KEY (`setting_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `ManualDeviceSettings_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ManualDeviceSettings`
--

LOCK TABLES `ManualDeviceSettings` WRITE;
/*!40000 ALTER TABLE `ManualDeviceSettings` DISABLE KEYS */;
INSERT INTO `ManualDeviceSettings` VALUES
(1,'kaleidoscopic4703','LED','off',43),
(2,'kaleidoscopic4703','Humidifier','off',24),
(3,'kaleidoscopic4703','Cooling Fan','off',63),
(4,'upset6211','LED','off',0),
(5,'upset6211','Humidifier','off',29),
(6,'upset6211','Cooling Fan','off',6),
(7,'probable5873','LED','on',94),
(8,'probable5873','Humidifier','off',8),
(9,'probable5873','Cooling Fan','on',82),
(10,'angelic8035','LED','on',91),
(11,'angelic8035','Humidifier','on',72),
(12,'angelic8035','Cooling Fan','on',34),
(13,'sneaky2518','LED','on',21),
(14,'sneaky2518','Humidifier','on',45),
(15,'sneaky2518','Cooling Fan','off',37),
(16,'entire3641','LED','on',76),
(17,'entire3641','Humidifier','on',100),
(18,'entire3641','Cooling Fan','off',10),
(19,'beautiful7070','LED','off',45),
(20,'beautiful7070','Humidifier','on',38),
(21,'beautiful7070','Cooling Fan','on',79),
(22,'educated5698','LED','off',89),
(23,'educated5698','Humidifier','off',49),
(24,'educated5698','Cooling Fan','on',8),
(25,'fearless9298','LED','off',74),
(26,'fearless9298','Humidifier','off',64),
(27,'fearless9298','Cooling Fan','on',40),
(28,'alive8574','LED','on',28),
(29,'alive8574','Humidifier','off',21),
(30,'alive8574','Cooling Fan','on',59),
(31,'firsthand7540','LED','off',51),
(32,'firsthand7540','Humidifier','off',89),
(33,'firsthand7540','Cooling Fan','on',0),
(34,'near1302','LED','on',98),
(35,'near1302','Humidifier','on',26),
(36,'near1302','Cooling Fan','on',5),
(37,'stormy3871','LED','off',71),
(38,'stormy3871','Humidifier','on',93),
(39,'stormy3871','Cooling Fan','on',31),
(40,'merry4427','LED','on',40),
(41,'merry4427','Humidifier','on',62),
(42,'merry4427','Cooling Fan','on',86),
(43,'rusty0405','LED','on',36),
(44,'rusty0405','Humidifier','on',70),
(45,'rusty0405','Cooling Fan','on',9),
(46,'nutritious2447','LED','off',36),
(47,'nutritious2447','Humidifier','on',97),
(48,'nutritious2447','Cooling Fan','off',23),
(49,'unused7744','LED','on',26),
(50,'unused7744','Humidifier','on',60),
(51,'unused7744','Cooling Fan','on',93),
(52,'candid7291','LED','off',6),
(53,'candid7291','Humidifier','off',9),
(54,'candid7291','Cooling Fan','off',41),
(55,'ancient1080','LED','on',98),
(56,'ancient1080','Humidifier','on',4),
(57,'ancient1080','Cooling Fan','on',26),
(58,'drafty9173','LED','on',65),
(59,'drafty9173','Humidifier','off',22),
(60,'drafty9173','Cooling Fan','on',85),
(61,'partial1633','LED','off',49),
(62,'partial1633','Humidifier','on',63),
(63,'partial1633','Cooling Fan','off',40),
(64,'knobby4353','LED','on',94),
(65,'knobby4353','Humidifier','on',82),
(66,'knobby4353','Cooling Fan','on',59),
(67,'aware3431','LED','off',85),
(68,'aware3431','Humidifier','off',3),
(69,'aware3431','Cooling Fan','off',26),
(70,'able4459','LED','off',59),
(71,'able4459','Humidifier','off',22),
(72,'able4459','Cooling Fan','on',38),
(73,'young7335','LED','on',93),
(74,'young7335','Humidifier','on',96),
(75,'young7335','Cooling Fan','on',34),
(76,'valid2242','LED','on',81),
(77,'valid2242','Humidifier','off',74),
(78,'valid2242','Cooling Fan','on',78),
(79,'neat9295','LED','off',27),
(80,'neat9295','Humidifier','on',83),
(81,'neat9295','Cooling Fan','off',55),
(82,'pointed3096','LED','on',69),
(83,'pointed3096','Humidifier','on',18),
(84,'pointed3096','Cooling Fan','off',22),
(85,'authentic5016','LED','off',60),
(86,'authentic5016','Humidifier','on',30),
(87,'authentic5016','Cooling Fan','on',88),
(124,'test123','LED','off',NULL),
(125,'test123','Humidifier','off',NULL),
(126,'test123','Cooling Fan','off',NULL);
/*!40000 ALTER TABLE `ManualDeviceSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Plantdata`
--

DROP TABLE IF EXISTS `Plantdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Plantdata` (
  `plantdata_ID` int(11) NOT NULL AUTO_INCREMENT,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `scientific_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `watering` varchar(255) DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `humidity` varchar(255) DEFAULT NULL,
  `light_demand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`plantdata_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plantdata`
--

LOCK TABLES `Plantdata` WRITE;
/*!40000 ALTER TABLE `Plantdata` DISABLE KEYS */;
INSERT INTO `Plantdata` VALUES
(1,'/home/t24107/v1.0src/backend/plantdata/Rudbeckia.webp','검은눈천인국','Rudbeckia hirta','검은눈천인국은 국화과에 속하는 여러해살이풀로, 높이는 60-80cm에 이르며, 두상화는 지름이 8-10cm이고, 중앙의 검은 눈이 특징적인 노란색 꽃을 가진다. 5월부터 9월까지 피며, 정원용으로 인기가 높다.','Weekly','20-35°C','40-60%','High'),
(2,'/home/t24107/v1.0src/backend/plantdata/Rhapis.webp','관음죽','Rhapis excelsa','관음죽은 평화백합이라고도 하며, 크고 광택 있는 녹색 잎과 흰색 꽃이 특징입니다. 실내에서 쉽게 재배할 수 있으며 공기 정화 능력도 뛰어납니다. 직사광선을 피하고 잘 배수된 토양에서 재배해야 합니다.','Weekly','16-20℃','40-70%','Medium'),
(3,'/home/t24107/v1.0src/backend/plantdata/Guzmania.webp','구즈마니아','Guzmania lingulata','구즈마니아는 밝은 색의 꽃과 긴 녹색 잎이 특징인 브로멜리아드과 식물입니다. 잎은 사발 모양을 형성하고, 중앙에서 화려한 꽃이 피어나며, 수개월간 꽃이 지속될 수 있습니다. 간접광을 선호하며, 사발에 물을 유지하는 것이 중요합니다.','Weekly','21-25℃','40-70%','Medium'),
(4,'/home/t24107/v1.0src/backend/plantdata/Coreopsis.webp','금계국','Coreopsis basalis','금계국은 밝은 노란색에서 오렌지색의 꽃을 가진 식물로, 봄과 여름에 주로 꽃을 피웁니다. 원산지는 북아메리카이며, 잘 배수된 토양과 햇빛을 선호합니다.','Weekly','10-30℃','30-50%','High'),
(5,'/home/t24107/v1.0src/backend/plantdata/Zamioculcas.webp','금전수','Zamioculcas zamiifolia','금전수는 두꺼운, 광택이 나는 짙은 녹색의 잎이 특징이며, 직립한 줄기는 저장 기관으로 물을 저장합니다. 낮은 빛 조건에서도 잘 자라며, 관리가 매우 용이하여 실내 환경에 적합합니다.','Bi-weekly','16-20℃','40-70%','Low'),
(6,'/home/t24107/v1.0src/backend/plantdata/Begonia.webp','꽃베고니아','Begonia semperflorens','꽃베고니아는 다양한 색상과 모양의 꽃을 제공하며, 광택이 나는 잎이 매력적인 식물입니다. 봄부터 가을까지 꽃이 지속적으로 피어나며, 밝은 간접광 아래에서 잘 자랍니다. 과습에 주의하며, 약간 산성의 잘 배수되는 토양을 선호합니다.','Weekly','21-25℃','70-100%','Medium'),
(7,'/home/t24107/v1.0src/backend/plantdata/Nephrolepis.webp','더피고사리','Nephrolepis cordifolia','더피고사리, 또는 보스턴 고사리는 긴 곱슬거리는 잎이 매력적인 실내 장식용 식물입니다. 잎은 밝은 녹색으로 우아하게 휘어져 있으며, 공기 중의 유해 물질을 제거하여 공기를 정화하는 데 효과적입니다. 밝은 간접광을 선호하며, 지나치게 마르지 않도록 주의해야 합니다.','Daily','16-20℃','70-100%','Medium'),
(8,'/home/t24107/v1.0src/backend/plantdata/Bellis.webp','데이지','Bellis perennis','데이지는 흰색 꽃잎과 노란색 중심을 가진 작고 매력적인 꽃으로, 봄부터 가을까지 꾸준히 피어납니다. 이 식물은 꽃밭이나 잔디밭에서 흔히 볼 수 있으며, 다양한 환경에 적응력이 뛰어납니다.','Weekly','10-25℃','50-60%','High'),
(9,'/home/t24107/v1.0src/backend/plantdata/Iris.webp','붓꽃','Iris sanguinea','붓꽃은 다양한 색상과 패턴을 가진 꽃으로, 독특한 꽃 모양이 특징입니다. 햇볕이 잘 드는 곳에서 잘 자라며, 봄부터 초여름에 걸쳐 화려하게 꽃을 피웁니다. 잘 배수되는 토양과 적절한 물주기로 관리해야 합니다.','Weekly','10-28°C','40-60%','High'),
(10,'/home/t24107/v1.0src/backend/plantdata/Sansevieria.webp','산세베리아','Sansevieria trifasciata','산세베리아, 또는 스네이크 플랜트는 직립하는 두꺼운 잎이 특징적인 식물로, 잎은 어두운 녹색 배경에 밝은 녹색의 수평 줄무늬를 가집니다. 낮은 빛 조건에서도 잘 자라며, 건조한 조건을 선호합니다. 공기 정화 능력이 뛰어납니다.','Bi-weekly','21-25°C','40-70%','Medium'),
(11,'/home/t24107/v1.0src/backend/plantdata/Peperomia.webp','수박페페로미아','Peperomia sandersii','수박페페로미아는 수박 껍질처럼 녹색과 은색의 줄무늬가 있는 둥근 잎이 특징인 식물입니다. 잎의 아름다운 무늬 때문에 인기가 높으며, 밝은 간접광 아래에서 잘 자랍니다. 토양은 잘 배수되어야 하며, 과습은 피해야 합니다.','Weekly','21-25°C','40-70%','Medium'),
(12,'/home/t24107/v1.0src/backend/plantdata/Iberis.webp','숙근이베리스','Iberis sempervirens','숙근이베리스는 밀집한 관목 형태로 자라며 최대 높이는 약 30cm입니다. 작은 늘푸른 잎과 봄에 화려하게 피는 순백색의 꽃들이 특징입니다. 햇볕이 많은 곳에서 잘 자라며, 잘 배수되는 토양에서 건조한 조건을 견딜 수 있습니다.','Weekly','21-25°C','40-70%','High'),
(13,'/home/t24107/v1.0src/backend/plantdata/Cyclamen.webp','시클라멘','Cyclamen persicum','시클라멘은 작은 크기와 아름다운 꽃으로 유명하며, 다양한 색상의 꽃을 겨울부터 봄까지 피웁니다. 잎은 심장 모양이며 어두운 녹색에 흰색 또는 은색 마블링이 있습니다. 강한 직사광선을 피하고 배수가 잘되는 토양에서 잘 자랍니다.','Weekly','16-20°C','40-70%','Medium'),
(14,'/home/t24107/v1.0src/backend/plantdata/Saintpaulia.webp','아프리칸 바이올렛','Saintpaulia ionantha','아프리칸바이올렛은 짙은 녹색의 잎과 주황색, 분홍색, 보라색, 자주색 등 다양한 색의 꽃이 특징이다. 크기가 작으며 간접광에서도 잘 자라므로 실내 관상용 식물로 키우기에 적합하다. 햇빛이 강한 여름에는 직사광선을 피하고 겨울철에는 10도 이상의 온도를 유지해야 한다. 화분 재배 시 물 빠짐이 좋도록 일반흙과 갯모래를 섞어 준비하면 좋다.','Weekly','16-20°C','40-70%','Medium'),
(15,'/home/t24107/v1.0src/backend/plantdata/Rosa.webp','장미','Rosa','장미는 그 다양한 종류와 향기로운 꽃으로 유명하며, 봄과 여름에 특히 아름다운 꽃을 피웁니다. 풍부한 햇볕과 잘 배수되는 비옥한 토양을 선호하며, 규칙적인 물주기가 필요합니다.','Weekly','16-30°C','40-60%','High'),
(16,'/home/t24107/v1.0src/backend/plantdata/Chlorophytum.webp','접란','Chlorophytum comosum','접란은 아프리카 열대지역이 원산 인 여러해살이 풀이다. 흰색 무늬의 뿌리에서 잎이 나와 밑으로 처진다. 흰색 또는 노란색 무늬가 있는 잎 사이에서 흰색 꽃이 총상으로 열리는 것이 특징이다.','Weekly','16-20°C','40-70%','Medium'),
(17,'/home/t24107/v1.0src/backend/plantdata/Pelargonium.webp','제라늄','Pelargonium hortorum','제라늄은 관상용 화초로 널리 쓰이며 분화로 많이 팔린다. 19세기에 가장 많은 발전을 거듭하며 여러 종이 개량되었다. 공 모양으로 촘촘히 짜인 붉은색, 분홍색, 흰색 등을 띠는 꽃이 봄부터 늦가을까지 핀다.','Weekly','25-32°C','40-70%','High'),
(18,'/home/t24107/v1.0src/backend/plantdata/Tulipa.webp','튤립','Tulipa gesneriana','튤립은 다양한 색상과 형태의 꽃을 가진 인기 있는 봄 꽃입니다. 햇볕이 잘 드는 곳에서 잘 자라며, 잘 배수되는 토양을 필요로 합니다. 꽃은 봄에 주로 피며, 꽃이 지난 후에는 물주기를 줄여야 합니다.','Weekly','18-27°C','40-60%','High'),
(19,'/home/t24107/v1.0src/backend/plantdata/Fatshedera.webp','팻츠헤데라','Fatshedera lizei','팻츠헤데라는 1912년 프랑스의 한 묘목장에서 팔손이(Fatsia japonica)의 \'모세리(Moserii)\' 종과 양담쟁이(Hedera helix)를 교배하여 만들어진 덩굴식물이다. 다섯 갈래의 잎이 나는 양담쟁이의 특성과 관목처럼 자라는 팔손이의 특성이 섞여 있다. 야외 정원에서 키우기도 하고 실내 식물로 키우기도 한다.','Weekly','16-20°C','40-70%','Medium'),
(20,'/home/t24107/v1.0src/backend/plantdata/Pteris.webp','프테리스','Pteris cretica','프테리스는 긴 잎의 중앙에 흰 무늬가 있는 관엽식물이고 잎은 우상복엽으로 1-3쌍이고 길이는 비교적 짧으며 모양과 색깔 무늬가 다양하고 아름답다.','Daily','21-25°C','70-100%','Low'),
(21,'/home/t24107/v1.0src/backend/plantdata/Hypoestes.webp','히포에스테스','Hypoestes phyllostachya','히포에스테스는 분홍색, 흰색 등의 땡땡이 무늬 잎이 가장 큰 특징으로 실내 장식용 화초로 인기가 많은 품종이다. 원산지와 같은 기후인 열대 및 아열대 지역에서는 다년생으로 야생 재배가 가능하나 온대지역에서는 한해살이로 야외 재배가 가능하다.','Weekly','21-25°C','40-70%','Medium'),
(22,'/home/t24107/v1.0src/backend/plantdata/Spathiphyllum.webp','스파티필룸','Spathiphyllum wallisii','스파티필룸은 광택이 나는 짙은 녹색 잎과 하얀 꽃이 특징입니다. 실내 공기 정화 능력이 뛰어나며 간접광을 선호합니다.','Weekly','18-24°C','60-80%','Low'),
(23,'/home/t24107/v1.0src/backend/plantdata/Dracaena.webp','드라세나','Dracaena fragrans','드라세나는 다양한 색상의 길쭉한 잎을 가지며, 실내에서 쉽게 키울 수 있는 인기 있는 관엽식물입니다.','Bi-weekly','18-25°C','40-60%','Medium'),
(24,'/home/t24107/v1.0src/backend/plantdata/Codiaeum.webp','크로톤','Codiaeum variegatum','크로톤은 밝고 다양한 색상의 잎을 가지는 실내 관엽식물입니다. 햇빛을 많이 받으면 더 아름다운 색을 띱니다.','Weekly','20-30°C','40-60%','High'),
(25,'/home/t24107/v1.0src/backend/plantdata/Ficus.webp','벤자민 고무나무','Ficus benjamina','벤자민 고무나무는 밝은 녹색 잎과 우아한 형태로 실내에서 인기가 많은 식물입니다. 잘 배수되는 토양을 선호합니다.','Weekly','18-24°C','50-70%','Medium'),
(26,'/home/t24107/v1.0src/backend/plantdata/Philodendron.webp','필로덴드론','Philodendron hederaceum','필로덴드론은 큰 녹색 잎을 가지며, 간접광에서도 잘 자라는 실내 관엽식물입니다.','Weekly','18-24°C','50-70%','Low'),
(27,'/home/t24107/v1.0src/backend/plantdata/Aspidistra.webp','아스피디스트라','Aspidistra elatior','아스피디스트라는 낮은 빛 조건에서도 잘 자라는 실내 식물로, 강한 잎이 특징입니다.','Monthly','10-24°C','40-60%','Low'),
(28,'/home/t24107/v1.0src/backend/plantdata/Aglaonema.webp','아글라오네마','Aglaonema commutatum','아글라오네마는 다양한 색상과 무늬의 잎을 가지는 실내 식물로, 간접광을 선호합니다.','Weekly','20-30°C','50-70%','Medium'),
(29,'/home/t24107/v1.0src/backend/plantdata/Calathea.webp','칼라데아','Calathea roseopicta','칼라데아는 아름다운 무늬의 잎을 가진 실내 식물로, 높은 습도와 간접광을 선호합니다.','Weekly','18-24°C','60-80%','Low'),
(30,'/home/t24107/v1.0src/backend/plantdata/Fern.webp','고사리','Nephrolepis exaltata','고사리는 실내에서 잘 자라는 식물로, 높은 습도와 간접광을 선호합니다.','Weekly','18-24°C','60-80%','Low');
/*!40000 ALTER TABLE `Plantdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SatisfactionSurveys`
--

DROP TABLE IF EXISTS `SatisfactionSurveys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SatisfactionSurveys` (
  `survey_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `ai_score` int(11) DEFAULT NULL,
  `service_score` int(11) DEFAULT NULL,
  `app_score` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`survey_id`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `SatisfactionSurveys_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SatisfactionSurveys`
--

LOCK TABLES `SatisfactionSurveys` WRITE;
/*!40000 ALTER TABLE `SatisfactionSurveys` DISABLE KEYS */;
INSERT INTO `SatisfactionSurveys` VALUES
(1,'test123',3,3,2,'다만, 사생활의 바에 헌법에.','2024-05-27 20:51:20'),
(2,'kaleidoscopic4703',3,4,3,'때에는 노력하여야 경우와 거듭.','2024-05-27 15:07:03'),
(3,'upset6211',1,1,5,'의하여 다만, 헌법에 확정될 장기 국민은 거듭 때까지는.','2024-05-27 08:50:10'),
(4,'probable5873',3,4,3,'보호를 범죄에 자유를 있다. 진흥하여야.','2024-05-27 17:12:45'),
(5,'angelic8035',2,2,3,'신체의 구성하지 국가는 다만, 도피 법률이 법률로써 영장을 진다. 범죄를.','2024-05-26 22:24:06'),
(6,'sneaky2518',4,3,3,'국내법과 사후에 같은 때에는.','2024-05-27 01:18:33'),
(7,'entire3641',1,4,2,'경우와 예술가의 보장하기.','2024-05-27 04:46:17'),
(8,'beautiful7070',3,2,5,'사항은 있을 아니하며, 영장을 아니하는 경우와 창달에 판결이 현행범인인.','2024-05-27 02:07:48'),
(9,'educated5698',3,5,1,'전통문화의 모든 의무를.','2024-05-27 21:18:11'),
(10,'fearless9298',1,2,5,'예술가의 때에는 범하고 행위시의 아니한다. 승인된.','2024-05-27 08:44:12'),
(11,'alive8574',5,2,4,'법률로 보호할 아니하며, 헌법에 형사피고인은 거듭 죄를.','2024-05-27 18:40:39'),
(12,'firsthand7540',5,2,4,'현행범인인 또는 이상의 판결이 판결이 노력하여야 정하는 때에는.','2024-05-27 10:36:48'),
(13,'near1302',3,5,5,'국민은 동일한 신문의 때에는 위하여 증거인멸의 예술가의 있을.','2024-05-27 15:23:28'),
(14,'stormy3871',1,1,3,'거듭 의무를 거듭.','2024-05-27 20:37:09'),
(15,'merry4427',1,5,1,'형에 판결이 정한다. 범하고.','2024-05-27 17:46:44'),
(16,'rusty0405',5,3,1,'바에 법률로써 법률에 국민은 소추되지 필요한 있을 보장하기.','2024-05-27 18:50:19'),
(17,'nutritious2447',4,1,1,'비밀과 형사피고인은 한다. 유죄의 영장을 신문의 동일한.','2024-05-27 07:06:29'),
(18,'unused7744',3,2,3,'의무를 권리는 무죄로 필요한 법률로써.','2024-05-26 23:44:09'),
(19,'candid7291',2,1,5,'수 무죄로 재외국민을 의무를 판결이 이상의 다만, 추정된다..','2024-05-27 10:08:55'),
(20,'ancient1080',3,2,2,'신체의 범죄에 경우와.','2024-05-27 05:50:28'),
(21,'drafty9173',2,1,2,'3년 신문의 노력하여야 또는 민족문화의 무죄로 평생교육을.','2024-05-27 15:16:52'),
(22,'partial1633',2,5,1,'권리는 비밀과 판결이 판결이 범죄에 판결이 모성의 권리는.','2024-05-27 10:02:48'),
(23,'knobby4353',3,5,4,'아니한다. 형사피고인은 무죄로 진흥하여야 확정될 무죄로 모든 바에.','2024-05-27 12:37:56'),
(24,'aware3431',2,1,4,'수 전통문화의 신체의 있을 국민은 보호를.','2024-05-27 08:42:40'),
(25,'able4459',2,3,4,'보호할 정한다. 의무교육은 진흥하여야 현행범인인 비밀과 있을 예술가의.','2024-05-27 20:10:49'),
(26,'young7335',5,4,3,'창달에 때까지는 사항은 대하여 형사피고인은 처벌받지 행위시의.','2024-05-27 18:30:54'),
(27,'valid2242',1,4,1,'저작자·발명가·과학기술자와 권리는 노력하여야 아니한다. 법률에.','2024-05-27 13:54:13'),
(28,'neat9295',3,5,5,'증거인멸의 사항은 예술가의.','2024-05-27 09:33:39'),
(29,'pointed3096',4,4,3,'보호를 효력을 일반적으로 청구할 염려가 행위시의 창달에 있다. 소추되지.','2024-05-27 02:53:19'),
(30,'authentic5016',4,2,2,'국가는 경우와 현행범인인.','2024-05-27 20:24:18');
/*!40000 ALTER TABLE `SatisfactionSurveys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorLogs`
--

DROP TABLE IF EXISTS `SensorLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SensorLogs` (
  `log_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `sensor_type` varchar(50) NOT NULL,
  `log_timestamp` timestamp NULL DEFAULT current_timestamp(),
  `value` decimal(10,0) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`log_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `SensorLogs_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1255 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorLogs`
--

LOCK TABLES `SensorLogs` WRITE;
/*!40000 ALTER TABLE `SensorLogs` DISABLE KEYS */;
INSERT INTO `SensorLogs` VALUES
(1103,'test123','temp','2024-05-31 09:36:09',25,'C'),
(1104,'test123','humi','2024-05-31 09:36:09',71,'%'),
(1105,'test123','soil','2024-05-31 09:36:10',67,'%'),
(1106,'test123','water','2024-05-31 09:36:10',91,'%'),
(1107,'test123','temp','2024-05-31 09:37:09',25,'C'),
(1108,'test123','humi','2024-05-31 09:37:09',55,'%'),
(1109,'test123','soil','2024-05-31 09:37:10',65,'%'),
(1110,'test123','water','2024-05-31 09:37:10',90,'%'),
(1111,'test123','temp','2024-05-31 09:38:09',25,'C'),
(1112,'test123','humi','2024-05-31 09:38:10',56,'%'),
(1113,'test123','soil','2024-05-31 09:38:10',65,'%'),
(1114,'test123','water','2024-05-31 09:38:10',89,'%'),
(1115,'test123','temp','2024-05-31 09:39:09',25,'C'),
(1116,'test123','humi','2024-05-31 09:39:10',56,'%'),
(1117,'test123','soil','2024-05-31 09:39:10',64,'%'),
(1118,'test123','water','2024-05-31 09:39:10',88,'%'),
(1119,'test123','temp','2024-05-31 09:40:09',25,'C'),
(1120,'test123','humi','2024-05-31 09:40:10',57,'%'),
(1121,'test123','soil','2024-05-31 09:40:10',64,'%'),
(1122,'test123','water','2024-05-31 09:40:10',88,'%'),
(1123,'test123','temp','2024-05-31 09:41:09',25,'C'),
(1124,'test123','humi','2024-05-31 09:41:10',67,'%'),
(1125,'test123','soil','2024-05-31 09:41:10',63,'%'),
(1126,'test123','water','2024-05-31 09:41:10',86,'%'),
(1127,'test123','temp','2024-05-31 09:42:09',25,'C'),
(1128,'test123','humi','2024-05-31 09:42:10',71,'%'),
(1129,'test123','soil','2024-05-31 09:42:10',63,'%'),
(1130,'test123','water','2024-05-31 09:42:10',86,'%'),
(1131,'test123','temp','2024-05-31 09:43:09',25,'C'),
(1132,'test123','humi','2024-05-31 09:43:10',53,'%'),
(1133,'test123','soil','2024-05-31 09:43:10',63,'%'),
(1134,'test123','water','2024-05-31 09:43:10',87,'%'),
(1135,'test123','temp','2024-06-06 12:16:40',26,'C'),
(1136,'test123','humi','2024-06-06 12:16:41',72,'%'),
(1137,'test123','soil','2024-06-06 12:16:41',65,'%'),
(1138,'test123','water','2024-06-06 12:16:41',78,'%'),
(1139,'test123','temp','2024-06-06 12:17:38',26,'C'),
(1140,'test123','humi','2024-06-06 12:17:38',59,'%'),
(1141,'test123','soil','2024-06-06 12:17:38',64,'%'),
(1142,'test123','water','2024-06-06 12:17:38',81,'%'),
(1143,'test123','temp','2024-06-06 12:18:38',26,'C'),
(1144,'test123','humi','2024-06-06 12:18:38',61,'%'),
(1145,'test123','soil','2024-06-06 12:18:38',65,'%'),
(1146,'test123','water','2024-06-06 12:18:38',84,'%'),
(1147,'test123','temp','2024-06-06 12:19:38',26,'C'),
(1148,'test123','humi','2024-06-06 12:19:38',61,'%'),
(1149,'test123','soil','2024-06-06 12:19:38',66,'%'),
(1150,'test123','water','2024-06-06 12:19:38',88,'%'),
(1151,'test123','temp','2024-06-06 12:20:38',26,'C'),
(1152,'test123','humi','2024-06-06 12:20:38',58,'%'),
(1153,'test123','soil','2024-06-06 12:20:38',66,'%'),
(1154,'test123','water','2024-06-06 12:20:38',91,'%'),
(1155,'test123','temp','2024-06-06 12:21:38',26,'C'),
(1156,'test123','humi','2024-06-06 12:21:38',57,'%'),
(1157,'test123','soil','2024-06-06 12:21:38',62,'%'),
(1158,'test123','water','2024-06-06 12:21:38',90,'%'),
(1159,'test123','temp','2024-06-06 12:22:38',26,'C'),
(1160,'test123','humi','2024-06-06 12:22:38',57,'%'),
(1161,'test123','soil','2024-06-06 12:22:38',64,'%'),
(1162,'test123','water','2024-06-06 12:22:38',92,'%'),
(1163,'test123','temp','2024-06-06 12:23:38',26,'C'),
(1164,'test123','humi','2024-06-06 12:23:38',58,'%'),
(1165,'test123','soil','2024-06-06 12:23:38',68,'%'),
(1166,'test123','water','2024-06-06 12:23:38',91,'%'),
(1167,'test123','temp','2024-06-06 12:24:38',26,'C'),
(1168,'test123','humi','2024-06-06 12:24:38',58,'%'),
(1169,'test123','soil','2024-06-06 12:24:38',65,'%'),
(1170,'test123','water','2024-06-06 12:24:38',94,'%'),
(1171,'test123','temp','2024-06-06 12:25:38',26,'C'),
(1172,'test123','humi','2024-06-06 12:25:38',59,'%'),
(1173,'test123','soil','2024-06-06 12:25:38',66,'%'),
(1174,'test123','water','2024-06-06 12:25:38',96,'%'),
(1175,'test123','temp','2024-06-07 07:40:49',24,'C'),
(1176,'test123','temp','2024-06-07 07:40:50',24,'C'),
(1177,'test123','humi','2024-06-07 07:40:50',74,'%'),
(1178,'test123','humi','2024-06-07 07:40:50',82,'%'),
(1179,'test123','soil','2024-06-07 07:40:50',62,'%'),
(1180,'test123','soil','2024-06-07 07:40:50',62,'%'),
(1181,'test123','water','2024-06-07 07:40:50',83,'%'),
(1182,'test123','water','2024-06-07 07:40:51',83,'%'),
(1183,'test123','temp','2024-06-07 07:54:02',22,'C'),
(1184,'test123','humi','2024-06-07 07:54:03',95,'%'),
(1185,'test123','soil','2024-06-07 07:54:03',65,'%'),
(1186,'test123','water','2024-06-07 07:54:03',91,'%'),
(1187,'test123','temp','2024-06-07 08:16:21',25,'C'),
(1188,'test123','humi','2024-06-07 08:16:21',70,'%'),
(1189,'test123','soil','2024-06-07 08:16:21',67,'%'),
(1190,'test123','water','2024-06-07 08:16:21',76,'%'),
(1191,'test123','temp','2024-06-07 08:17:19',24,'C'),
(1192,'test123','humi','2024-06-07 08:17:19',61,'%'),
(1193,'test123','soil','2024-06-07 08:17:19',66,'%'),
(1194,'test123','water','2024-06-07 08:17:19',80,'%'),
(1195,'test123','temp','2024-06-07 08:18:19',24,'C'),
(1196,'test123','humi','2024-06-07 08:18:19',66,'%'),
(1197,'test123','soil','2024-06-07 08:18:19',66,'%'),
(1198,'test123','water','2024-06-07 08:18:19',82,'%'),
(1199,'test123','temp','2024-06-07 08:19:19',24,'C'),
(1200,'test123','humi','2024-06-07 08:19:19',68,'%'),
(1201,'test123','soil','2024-06-07 08:19:19',66,'%'),
(1202,'test123','water','2024-06-07 08:19:19',83,'%'),
(1203,'test123','temp','2024-06-07 08:20:19',24,'C'),
(1204,'test123','humi','2024-06-07 08:20:19',69,'%'),
(1205,'test123','soil','2024-06-07 08:20:19',66,'%'),
(1206,'test123','water','2024-06-07 08:20:19',83,'%'),
(1207,'test123','temp','2024-06-07 08:21:19',24,'C'),
(1208,'test123','humi','2024-06-07 08:21:19',70,'%'),
(1209,'test123','soil','2024-06-07 08:21:19',66,'%'),
(1210,'test123','water','2024-06-07 08:21:19',81,'%'),
(1211,'test123','temp','2024-06-07 08:22:19',24,'C'),
(1212,'test123','humi','2024-06-07 08:22:19',65,'%'),
(1213,'test123','soil','2024-06-07 08:22:19',67,'%'),
(1214,'test123','water','2024-06-07 08:22:19',81,'%'),
(1215,'test123','temp','2024-06-07 08:23:19',24,'C'),
(1216,'test123','humi','2024-06-07 08:23:19',68,'%'),
(1217,'test123','soil','2024-06-07 08:23:19',67,'%'),
(1218,'test123','water','2024-06-07 08:23:19',80,'%'),
(1219,'test123','temp','2024-06-07 08:24:19',24,'C'),
(1220,'test123','humi','2024-06-07 08:24:19',70,'%'),
(1221,'test123','soil','2024-06-07 08:24:19',68,'%'),
(1222,'test123','water','2024-06-07 08:24:19',78,'%'),
(1223,'test123','temp','2024-06-07 08:25:19',23,'C'),
(1224,'test123','humi','2024-06-07 08:25:19',64,'%'),
(1225,'test123','soil','2024-06-07 08:25:19',68,'%'),
(1226,'test123','water','2024-06-07 08:25:19',78,'%'),
(1227,'test123','temp','2024-06-07 08:26:19',23,'C'),
(1228,'test123','humi','2024-06-07 08:26:19',67,'%'),
(1229,'test123','soil','2024-06-07 08:26:19',68,'%'),
(1230,'test123','water','2024-06-07 08:26:19',77,'%'),
(1231,'test123','temp','2024-06-07 08:27:19',23,'C'),
(1232,'test123','humi','2024-06-07 08:27:19',70,'%'),
(1233,'test123','soil','2024-06-07 08:27:19',68,'%'),
(1234,'test123','water','2024-06-07 08:27:19',76,'%'),
(1235,'test123','temp','2024-06-07 08:28:19',23,'C'),
(1236,'test123','humi','2024-06-07 08:28:19',63,'%'),
(1237,'test123','soil','2024-06-07 08:28:19',69,'%'),
(1238,'test123','water','2024-06-07 08:28:19',75,'%'),
(1239,'test123','temp','2024-06-07 08:29:19',23,'C'),
(1240,'test123','humi','2024-06-07 08:29:19',67,'%'),
(1241,'test123','soil','2024-06-07 08:29:19',69,'%'),
(1242,'test123','water','2024-06-07 08:29:19',75,'%'),
(1243,'test123','temp','2024-06-07 08:30:19',23,'C'),
(1244,'test123','humi','2024-06-07 08:30:19',69,'%'),
(1245,'test123','soil','2024-06-07 08:30:19',69,'%'),
(1246,'test123','water','2024-06-07 08:30:19',74,'%'),
(1247,'test123','temp','2024-06-07 08:31:19',23,'C'),
(1248,'test123','humi','2024-06-07 08:31:19',64,'%'),
(1249,'test123','soil','2024-06-07 08:31:19',69,'%'),
(1250,'test123','water','2024-06-07 08:31:19',75,'%'),
(1251,'test123','temp','2024-06-07 08:32:19',23,'C'),
(1252,'test123','humi','2024-06-07 08:32:19',65,'%'),
(1253,'test123','soil','2024-06-07 08:32:19',67,'%'),
(1254,'test123','water','2024-06-07 08:32:19',74,'%');
/*!40000 ALTER TABLE `SensorLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemAutoMode`
--

DROP TABLE IF EXISTS `SystemAutoMode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SystemAutoMode` (
  `auto_mode_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `mode` enum('on','off') DEFAULT NULL,
  PRIMARY KEY (`auto_mode_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `SystemAutoMode_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemAutoMode`
--

LOCK TABLES `SystemAutoMode` WRITE;
/*!40000 ALTER TABLE `SystemAutoMode` DISABLE KEYS */;
INSERT INTO `SystemAutoMode` VALUES
(1,'kaleidoscopic4703','on'),
(2,'upset6211','on'),
(3,'probable5873','off'),
(4,'angelic8035','off'),
(5,'sneaky2518','on'),
(6,'entire3641','off'),
(7,'beautiful7070','off'),
(8,'educated5698','on'),
(9,'fearless9298','off'),
(10,'alive8574','on'),
(11,'firsthand7540','off'),
(12,'near1302','off'),
(13,'stormy3871','off'),
(14,'merry4427','off'),
(15,'rusty0405','off'),
(16,'nutritious2447','off'),
(17,'unused7744','off'),
(18,'candid7291','on'),
(19,'ancient1080','on'),
(20,'drafty9173','on'),
(21,'partial1633','on'),
(22,'knobby4353','off'),
(23,'aware3431','on'),
(24,'able4459','on'),
(25,'young7335','on'),
(26,'valid2242','off'),
(27,'neat9295','on'),
(28,'pointed3096','off'),
(29,'authentic5016','off'),
(42,'test123','on');
/*!40000 ALTER TABLE `SystemAutoMode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Plants`
--

DROP TABLE IF EXISTS `User_Plants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Plants` (
  `user_plant_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(255) NOT NULL,
  `plantdata_ID` int(11) NOT NULL,
  `photo_ID` int(11) DEFAULT NULL,
  `date_registered` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`user_plant_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `plantdata_ID` (`plantdata_ID`),
  KEY `photo_ID` (`photo_ID`),
  CONSTRAINT `User_Plants_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `Users` (`user_ID`),
  CONSTRAINT `User_Plants_ibfk_2` FOREIGN KEY (`plantdata_ID`) REFERENCES `Plantdata` (`plantdata_ID`),
  CONSTRAINT `User_Plants_ibfk_3` FOREIGN KEY (`photo_ID`) REFERENCES `Device_photos` (`photo_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Plants`
--

LOCK TABLES `User_Plants` WRITE;
/*!40000 ALTER TABLE `User_Plants` DISABLE KEYS */;
INSERT INTO `User_Plants` VALUES
(1,'kaleidoscopic4703',1,1,'2024-05-24 20:14:08'),
(2,'upset6211',2,2,'2024-05-24 05:47:41'),
(3,'probable5873',3,3,'2024-05-24 08:55:08'),
(4,'angelic8035',4,4,'2024-05-25 00:32:42'),
(5,'sneaky2518',5,5,'2024-05-24 10:33:33'),
(6,'entire3641',6,6,'2024-05-24 09:08:52'),
(7,'beautiful7070',7,7,'2024-05-24 15:13:15'),
(8,'educated5698',8,8,'2024-05-24 21:18:46'),
(9,'fearless9298',9,9,'2024-05-24 21:59:03'),
(10,'alive8574',10,10,'2024-05-24 02:09:42'),
(11,'firsthand7540',11,11,'2024-05-24 06:03:18'),
(12,'near1302',12,12,'2024-05-24 08:27:15'),
(13,'stormy3871',13,13,'2024-05-24 16:29:07'),
(14,'merry4427',14,14,'2024-05-24 17:58:21'),
(15,'rusty0405',15,15,'2024-05-24 18:10:19'),
(16,'nutritious2447',16,16,'2024-05-24 15:55:52'),
(17,'unused7744',17,17,'2024-05-24 08:06:27'),
(18,'candid7291',18,18,'2024-05-24 09:08:44'),
(19,'ancient1080',19,19,'2024-05-24 06:52:23'),
(20,'drafty9173',20,20,'2024-05-24 07:16:12'),
(21,'partial1633',21,21,'2024-05-24 12:47:31'),
(22,'knobby4353',22,22,'2024-05-24 12:29:36'),
(23,'aware3431',23,23,'2024-05-24 02:48:12'),
(24,'able4459',24,24,'2024-05-24 23:55:51'),
(25,'young7335',25,25,'2024-05-24 19:27:23'),
(26,'valid2242',26,26,'2024-05-24 09:03:58'),
(27,'neat9295',27,27,'2024-05-24 08:54:33'),
(28,'pointed3096',28,28,'2024-05-24 09:18:11'),
(29,'authentic5016',29,29,'2024-05-24 18:29:02'),
(44,'test123',10,61,'2024-05-31 18:36:01');
/*!40000 ALTER TABLE `User_Plants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `user_ID` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `register_date` date DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT NULL,
  `device_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_ID`),
  UNIQUE KEY `email` (`email`),
  KEY `device_ID` (`device_ID`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`device_ID`) REFERENCES `Devices` (`device_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES
('able4459','$2b$10$N.31H6vlcwJHrBm542Q/muXdYY02f9sH32NT7yuuaaRy7z3D5agcm','최수호','male','1998-10-24','able4459@gmail.com','2023-05-18','active',24),
('alive8574','$2b$10$Eb33JZ3BuZZ79cD2dZ/j/eCx9w6b9dB4MSe76Y4viPzNOqviKfQhK','최민정','female','1986-03-24','alive8574@gmail.com','2022-10-16','active',10),
('ancient1080','$2b$10$lXPDDMIFhDyzrqpLFBzAF./63XOsoG5Ad/5jonVl/qtzKrcVzMrvq','박소연','female','1998-01-10','ancient1080@gmail.com','2022-09-07','active',19),
('angelic8035','$2b$10$S9P3qFVRVH45RWKy6QxuGee65LUAiyT0adbciDVQ3NEKqvxPXx1MS','최지우','female','1980-01-19','angelic8035@gmail.com','2023-01-10','active',4),
('authentic5016','$2b$10$W9EGwZPw8rYH7hnSmbCVmuY3dOAydBRhh/tiRw/Wysbi6RIEdiijq','최민수','male','1992-12-18','authentic5016@gmail.com','2023-05-15','active',29),
('aware3431','$2b$10$2WlRxlJrxeooUmf6pvvGb.aMxY26F/6wbOQgVcIU1yMn41kJm4jmS','유민지','female','1978-08-22','aware3431@gmail.com','2023-06-24','active',23),
('beautiful7070','$2b$10$SRAHBA/MVyQxhCOnPMw7uuM/J6yUXbgbOBtxT.GELv24DUuJ7ratq','김지영','female','1973-02-26','beautiful7070@gmail.com','2023-10-16','active',7),
('candid7291','$2b$10$pePOteFo2rgUMZgFwe748.2r2ErzqdrdCY9YM/9mMKQfHjw7SuzeC','이서준','male','1993-03-08','candid7291@gmail.com','2023-01-09','active',18),
('drafty9173','$2b$10$D4gVSc/9Bwm.fqPW9wCTEuuelPysMKQs7HZVPMz4UCuoBNylfwPEC','한승현','male','1989-06-04','drafty9173@gmail.com','2024-02-25','active',20),
('educated5698','$2b$10$.vs3do7TfpOK1N/BiJm4COlSqIE2diyVf9o4UaaQdzjhSISzKpcGy','신동엽','male','1986-07-14','educated5698@gmail.com','2022-07-01','active',8),
('entire3641','$2b$10$bzNG.t3zCi76tmSsqRMSPOcv1ztw6gooDuOXX0hc3CyVGyBUmRjO.','홍길동','male','1990-07-09','entire3641@gmail.com','2023-01-04','active',6),
('fearless9298','$2b$10$KvtJhbFsOMgViH3kHw6gQuiRZuDiTtipFYEfwLhvy6.05G.08JSaK','정현수','male','1975-06-25','fearless9298@gmail.com','2022-11-07','active',9),
('firsthand7540','$2b$10$siDV3dWyrN3AOuavH28Ra.yZrfHLtpPqv700LTTwgBt.orl2/ZVyS','이준서','male','1977-03-09','firsthand7540@gmail.com','2023-09-15','active',11),
('kaleidoscopic4703','$2b$10$LfO06AtzLWiljq3JloKTuORxibGeLQugVMp14xGhQJLf164TjmuPa','김민수','male','1989-08-09','kaleidoscopic4703@gmail.com','2022-07-24','active',1),
('knobby4353','$2b$10$NFxSDzwm.52.4qp05Ovgc.ssL1AOmswTq25zTHLyaP3hmzdD/arw2','서현우','male','1970-04-21','knobby4353@gmail.com','2022-05-30','active',22),
('merry4427','$2b$10$zNPKucTu0DCDipn/tuBqDuLQoShTiR3V5RPp86TPDQjjgSYTtuKma','임채원','female','1980-11-05','merry4427@gmail.com','2022-06-10','active',14),
('near1302','$2b$10$aNaFbE6iCKGJa5lqMksbmuwnJbrOz6FvF4W8GnuETypPkEs9kIE4m','박지민','female','1989-04-23','near1302@gmail.com','2022-10-07','active',12),
('neat9295','$2b$10$M6.VdjZyWuCaKeCOj0RtZu.m1EC0n85ZMV3ahKaLFvg/RjyiXg7aa','신지호','male','1978-01-16','neat9295@gmail.com','2023-05-22','active',27),
('nutritious2447','$2b$10$0E2Vqj9jfhllA.18utsUx.XoxFo6/gj54LEESPedac3sgEnYnMBnu','정수민','male','1979-04-16','nutritious2447@gmail.com','2023-08-28','active',16),
('partial1633','$2b$10$.PSTmselKgVA1MZ802I9h.Cf01hkEM4ijzkiNV8qod8idbZUTgSve','강수현','female','1975-01-09','partial1633@gmail.com','2023-01-30','active',21),
('pointed3096','$2b$10$Ptg16H0C.ol4/u1n8HlMq.XlNgbC0Et3Wlu9Pf82QIlIzKW/IiWXu','김지후','male','1977-12-19','pointed3096@gmail.com','2023-12-20','active',28),
('probable5873','$2b$10$NF7vGc/65HhNTPkC5d3AzOpHjlYO1zJ3Gex/QMJHqkXW6Fgnq1IJO','박철수','male','1983-02-22','probable5873@gmail.com','2023-04-21','active',3),
('rusty0405','$2b$10$TiXURCvv2/XxHudzCjrVb.NMEe9StccxR9JXBHBnWUZD1uZIej8yu','장서준','male','1975-06-01','rusty0405@gmail.com','2023-11-20','active',15),
('sneaky2518','$2b$10$1gfHFcpzX.EoLmuMW/p99O6ReCYWVtv9EcfB9LojW0lmQu20z/vzi','장준혁','male','1983-10-20','sneaky2518@gmail.com','2022-06-13','active',5),
('stormy3871','$2b$10$omfNcNOPsEAMCASF73Gq1OwB6JHiidB4kKklyHNKwrYr.jd/FcRi.','윤서영','female','1980-07-06','stormy3871@gmail.com','2023-07-05','active',13),
('test123','$2b$10$fIeVLVAGgm7dAxoNnZUkAO8SAh3xYJdauG.iW5igD9Uu5teT0bC9S','테스트','male','2000-11-22','test123@gmail.com','2024-05-25','active',NULL),
('unused7744','$2b$10$1eKkImMU8rtzwNmnrt15H.XSaKVZyTV.nZMdglAG/tdQ87M2VY9qG','김가영','female','1975-05-24','unused7744@gmail.com','2023-04-20','active',17),
('upset6211','$2b$10$GVWnc6Cmyujpvx31IwmDsuhQ1/CFYsj8zpTDZrrA8k0aZ.qqMPrB2','이영희','female','1980-08-19','upset6211@gmail.com','2024-01-16','active',2),
('valid2242','$2b$10$/BXqSzzeuQfiOwng4kOWdu0E7yKgdhKAvzuIhZDLKo0FOhySOXGjW','장하은','female','1986-06-30','valid2242@gmail.com','2024-03-19','active',26),
('young7335','$2b$10$imDcv4pIGiak7pRz1VPnE.osy4saUxEH1xLAZ180Ptm3UJuJCYXMK','오준서','male','1998-04-16','young7335@gmail.com','2023-10-23','active',25);
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

-- Dump completed on 2024-06-10  1:22:45
