CREATE TABLE IF NOT EXISTS `my_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) CHARACTER SET latin1 NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 ;

INSERT INTO `my_table` (`id`, `type`) VALUES
(1, 'one'),
(2, 'two'),
(3, 'three'),
(4, 'four');

CREATE TABLE IF NOT EXISTS `my_table2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) CHARACTER SET latin1 NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `my_table2` (`id`, `type`) VALUES
(1, 'one'),
(2, 'two'),
(3, 'three'),
(4, 'four');

INSERT INTO `my_table2` (`id`, `type`) VALUES
(5, 'five'),
(6, 'six'),
(7, 'seven'),
(8, 'eight');
