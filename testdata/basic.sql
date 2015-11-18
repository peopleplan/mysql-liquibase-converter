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

CREATE TRIGGER `my_trigger` AFTER DELETE ON `my_table`
FOR EACH ROW BEGIN
    update  `summary` set my_value = my_value - 1 where id = old.my_id;
END
