DELETE FROM project;
DELETE FROM `user`;

INSERT INTO projektarbeit.`user` (id,academic_title,matriculation_number,first_name,last_name,email,password,phone_number) VALUES
	 ('b21cfc80-a823-11ee-871a-0242ac120002',NULL,7022410,'Niklas','Hagengers','niklas.hagengers@stud.hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b21e2108-a823-11ee-871a-0242ac120002',NULL,7020985,'Max','Hahn','max.hahn@stud.hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b21f1455-a823-11ee-871a-0242ac120002',NULL,7011916,'Jasper','Gnüg','jasper.gnueg@stud.hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b21fef5b-a823-11ee-871a-0242ac120002',NULL,7013597,'Marcus','Rosengart','marcus.rosengart@stud.hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b220c85c-a823-11ee-871a-0242ac120002',NULL,7022319,'Torben','Landwehr','torben.landwehr@stud.hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b221c5a8-a823-11ee-871a-0242ac120002','Prof.',NULL,'Maria','Krüger-Basener','krueger-basener@technik-emden.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b22298f0-a823-11ee-871a-0242ac120002','Prof. Dr. rer. nat.',NULL,'Thorsten','Schmidt','thorsten.schmidt@hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('b22344ba-a823-11ee-871a-0242ac120002',NULL,NULL,'Hilke','Fasse','hilke.fasse@hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',NULL),
	 ('223ea86e-a68b-11ee-97c1-0242ac120002',NULL,7022823,'Neklas','Meyer','neklas.meyer@stud.hs-emden-leer.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2','+49 1573 6970288');

INSERT INTO projektarbeit.project (id,name,official_start,official_end,report_interval,`type`,ownerId) VALUES
	 ('c94c5795-a051-11ee-b998-0242c0a87002','Projektarbeit','2023-03-07','2023-05-30',7,'Softwareprojekt','223ea86e-a68b-11ee-97c1-0242ac120002');

INSERT INTO projektarbeit.project_member (id,`role`,userId,projectId) VALUES
	 ('fa0eb76d-a823-11ee-871a-0242ac120002','contributor','b21cfc80-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa0f9483-a823-11ee-871a-0242ac120002','contributor','b21e2108-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa11a611-a823-11ee-871a-0242ac120002','contributor','b21f1455-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa12570c-a823-11ee-871a-0242ac120002','contributor','b21fef5b-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa135342-a823-11ee-871a-0242ac120002','contributor','b220c85c-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa13f2b5-a823-11ee-871a-0242ac120002','viewer','b221c5a8-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa14b1a6-a823-11ee-871a-0242ac120002','viewer','b22298f0-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002'),
	 ('fa15e088-a823-11ee-871a-0242ac120002','viewer','b22344ba-a823-11ee-871a-0242ac120002','c94c5795-a051-11ee-b998-0242c0a87002');

INSERT INTO projektarbeit.project_report (id,sequence_number,report_date,deliverables,hazards,objectives,other,projectId) VALUES
	 ('6ad77508-a83a-11ee-871a-0242ac120002',1,'2023-05-09','Zum aktuellen Zeitpunkt wurde der Großteil der Meilensteine erreicht. Teilweise nahmen diese weniger Aufwand in Anspruch als ursprünglich angenommen.
Es verbleiben zwei Meilensteine:
- der Abschluss der Qualitätssicherung
- die Abgabe der/des Endpräsentation/Projekts

Der erstere benötigt etwas länger als geplant, dies gleicht sich allerdings durch die entstandenen Puffer aus, sodass die beiden verbleibenden Meilensteine aller Voraussicht nach pünktlich zu erreichen sind.','Zum aktuellen Zeitpunkt bestehen aufgrund des fortgeschrittenen Entwicklungsstatus wenig Risiken. Das einzig bestehende Risiko ist eine mangelhafte Qualitätssicherung. So könnte es im schlimmsten Fall zu einer Verzögerung des Meilensteins kommen, sollten erst spät kritische Fehler entdeckt werden.','Die Stabilität und Funktionalität des Programms soll endgültig geprüft und garantiert werden. Dafür wird das Programm auf verschiedenen Systemen und auf die definierten Anforderungen getestet.','lol','c94c5795-a051-11ee-b998-0242c0a87002');

INSERT INTO projektarbeit.project_milestone (id,name,projectId,milestone_reached) VALUES
	 ('aad6cad5-a824-11ee-871a-0242ac120002','Anforderungen festlegen','c94c5795-a051-11ee-b998-0242c0a87002',1),
	 ('aad79bb4-a824-11ee-871a-0242ac120002','Hochladen/Analyse der Daten','c94c5795-a051-11ee-b998-0242c0a87002',1),
	 ('aad8e7ef-a824-11ee-871a-0242ac120002','Anwendungsdesign festgelegt','c94c5795-a051-11ee-b998-0242c0a87002',1),
	 ('aad9a24e-a824-11ee-871a-0242ac120002','Integration von Design/Funktionalität','c94c5795-a051-11ee-b998-0242c0a87002',1),
	 ('aada467d-a824-11ee-871a-0242ac120002','Abschluss Qualitätssicherung','c94c5795-a051-11ee-b998-0242c0a87002',1),
	 ('aadb1b80-a824-11ee-871a-0242ac120002','Abgabe Präsentation','c94c5795-a051-11ee-b998-0242c0a87002',1);

INSERT INTO projektarbeit.milestone_estimate (id,report_date,estimation_date,milestoneId) VALUES
	 ('02541201-a998-11ee-9d95-0242ac120002','2023-03-07','2023-04-04','aad6cad5-a824-11ee-871a-0242ac120002'),
	 ('9b6ec3a9-a99b-11ee-9d95-0242ac120002','2023-03-14','2023-04-04','aad6cad5-a824-11ee-871a-0242ac120002'),
	 ('9b6fa738-a99b-11ee-9d95-0242ac120002','2023-03-21','2023-04-04','aad6cad5-a824-11ee-871a-0242ac120002'),
	 ('9b707614-a99b-11ee-9d95-0242ac120002','2023-03-28','2023-04-04','aad6cad5-a824-11ee-871a-0242ac120002'),
	 ('9b712595-a99b-11ee-9d95-0242ac120002','2023-04-04','2023-04-04','aad6cad5-a824-11ee-871a-0242ac120002'),
	 ('efa30c13-a99b-11ee-9d95-0242ac120002','2023-03-07','2023-04-18','aad79bb4-a824-11ee-871a-0242ac120002'),
	 ('efa3eeb3-a99b-11ee-9d95-0242ac120002','2023-03-14','2023-04-18','aad79bb4-a824-11ee-871a-0242ac120002'),
	 ('efa4940e-a99b-11ee-9d95-0242ac120002','2023-03-21','2023-04-18','aad79bb4-a824-11ee-871a-0242ac120002'),
	 ('efa52ca2-a99b-11ee-9d95-0242ac120002','2023-03-28','2023-04-18','aad79bb4-a824-11ee-871a-0242ac120002'),
	 ('efa5cd80-a99b-11ee-9d95-0242ac120002','2023-04-04','2023-04-11','aad79bb4-a824-11ee-871a-0242ac120002');
INSERT INTO projektarbeit.milestone_estimate (id,report_date,estimation_date,milestoneId) VALUES
	 ('efa668f9-a99b-11ee-9d95-0242ac120002','2023-04-11','2023-04-11','aad79bb4-a824-11ee-871a-0242ac120002'),
	 ('38e810c7-a99c-11ee-9d95-0242ac120002','2023-03-07','2023-05-02','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('38e8d9e9-a99c-11ee-9d95-0242ac120002','2023-03-14','2023-05-02','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('38e966bc-a99c-11ee-9d95-0242ac120002','2023-03-21','2023-05-02','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('38ea0420-a99c-11ee-9d95-0242ac120002','2023-03-28','2023-05-02','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('38eaa0d7-a99c-11ee-9d95-0242ac120002','2023-04-04','2023-05-02','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('38eb3f57-a99c-11ee-9d95-0242ac120002','2023-04-11','2023-04-25','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('38ebdbd5-a99c-11ee-9d95-0242ac120002','2023-04-18','2023-04-18','aad8e7ef-a824-11ee-871a-0242ac120002'),
	 ('889e6921-a99c-11ee-9d95-0242ac120002','2023-03-07','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('889f39dd-a99c-11ee-9d95-0242ac120002','2023-03-14','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002');
INSERT INTO projektarbeit.milestone_estimate (id,report_date,estimation_date,milestoneId) VALUES
	 ('889fcabb-a99c-11ee-9d95-0242ac120002','2023-03-21','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('88a0712b-a99c-11ee-9d95-0242ac120002','2023-03-28','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('88a16bbc-a99c-11ee-9d95-0242ac120002','2023-04-04','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('88a21b95-a99c-11ee-9d95-0242ac120002','2023-04-11','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('88a2c061-a99c-11ee-9d95-0242ac120002','2023-04-18','2023-05-16','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('88a38a0b-a99c-11ee-9d95-0242ac120002','2023-04-25','2023-05-09','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('88a44932-a99c-11ee-9d95-0242ac120002','2023-05-02','2023-05-02','aad9a24e-a824-11ee-871a-0242ac120002'),
	 ('1384b551-a99d-11ee-9d95-0242ac120002','2023-03-07','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('1385798b-a99d-11ee-9d95-0242ac120002','2023-03-14','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('13860af0-a99d-11ee-9d95-0242ac120002','2023-03-21','2023-05-23','aada467d-a824-11ee-871a-0242ac120002');
INSERT INTO projektarbeit.milestone_estimate (id,report_date,estimation_date,milestoneId) VALUES
	 ('13872552-a99d-11ee-9d95-0242ac120002','2023-03-28','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('1387bf75-a99d-11ee-9d95-0242ac120002','2023-04-04','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('13886ee8-a99d-11ee-9d95-0242ac120002','2023-04-11','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('13895edb-a99d-11ee-9d95-0242ac120002','2023-04-18','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('138a234c-a99d-11ee-9d95-0242ac120002','2023-04-25','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('138ad292-a99d-11ee-9d95-0242ac120002','2023-05-02','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('138b72b6-a99d-11ee-9d95-0242ac120002','2023-05-09','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('138c0e3d-a99d-11ee-9d95-0242ac120002','2023-05-16','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('138ceb47-a99d-11ee-9d95-0242ac120002','2023-05-23','2023-05-23','aada467d-a824-11ee-871a-0242ac120002'),
	 ('138d9c1f-a99d-11ee-9d95-0242ac120002','2023-03-07','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002');
INSERT INTO projektarbeit.milestone_estimate (id,report_date,estimation_date,milestoneId) VALUES
	 ('138e5213-a99d-11ee-9d95-0242ac120002','2023-03-14','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('138ef22d-a99d-11ee-9d95-0242ac120002','2023-03-21','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('138f945d-a99d-11ee-9d95-0242ac120002','2023-03-28','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('139034ac-a99d-11ee-9d95-0242ac120002','2023-04-04','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('1390d7eb-a99d-11ee-9d95-0242ac120002','2023-04-11','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('13917386-a99d-11ee-9d95-0242ac120002','2023-04-18','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('1391f77e-a99d-11ee-9d95-0242ac120002','2023-04-25','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('13928029-a99d-11ee-9d95-0242ac120002','2023-05-02','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('139303c8-a99d-11ee-9d95-0242ac120002','2023-05-09','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('139379e5-a99d-11ee-9d95-0242ac120002','2023-05-16','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002');
INSERT INTO projektarbeit.milestone_estimate (id,report_date,estimation_date,milestoneId) VALUES
	 ('1393e0d0-a99d-11ee-9d95-0242ac120002','2023-05-23','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002'),
	 ('13949e9d-a99d-11ee-9d95-0242ac120002','2023-05-30','2023-05-30','aadb1b80-a824-11ee-871a-0242ac120002');
