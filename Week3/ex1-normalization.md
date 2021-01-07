Exercise 1 : Normalization

The manager of the dinner club would like to manage the information system that assists him to keep track of the dinners had by members. Because the manager is not an expert of Information Systems, (s)he uses the following table to store the information. Please help the manger by using the knowledge of database normal forms. Save all answers in a text file / MD file.

    What columns violate 1NF?
    What entities do you recognize that could be extracted?
    Name all the tables and columns that would make a 3NF compliant solution.


- food_code and food_description violate 1NF because they include multiple values.
- entities that I could recognize were: members, dinners, venues and food
- To make 3NF copliant, I would add 2 more entities here to establish many-to-many connections: appointments and orders. I draw Entities Relationship Diagram in 'diagram.jpg'. Please take a look at it.
![Diagram](https://github.com/shenshin/databases-1/blob/week3-ALEKS_SHENSHIN/Week3/diagram.jpg)