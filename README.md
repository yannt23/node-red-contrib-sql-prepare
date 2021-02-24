# node-red-contrib-sql-prepare
========================

Install
-------

Either use the `Node-RED Menu - Manage Palette - Install`, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-sql-prepare


Usage
-----

A node that converts array data input to sql insert
	The node needs 
	`msg.column_name` set as an array of table columns, 
	`msg.column_sort` as array for data value,
	`msg.command` to tell the node what to do, 
	`msg.data` as array for data select,
	`msg.column_data` for update value if the update is used and 
	`msg.database` as string with the name of the Database table.
	
**Note**
The Arrays for INSERT some data can be as long as you want, it s just important, that the length of `msg.column_name` and `msg.column_sort` is the same;
The Arrays for SELECT some data can be as long as you want;
You can only update one column, the term arrays for defining the update can be as long as you need them;
You can delete all columns, which have the same statements you define them;
	
	
	Example:
	**INSERT into Database
		
		|column1	|column2	|column3|
		|---------------|:-------------:|------:|
		|5		|  Text   	|  8	|
		
		`msg.column_name` = [column1,column2,column3];
		`msg.column_sort` = [5,"Text",8];
		`msg.database` = "test";
		`msg.command` = "insert";
		*INSERT INTO test (column1,column2,column3) VALUES(5,"Text",8)
		
		
	**SELECT hole row (*) from Database**
		
		|column1	|column2	|column3|
		|---------------|:-------------:|------:|
		|   5		| Text1    	|  452	|
		|   6		| Text2		|  24	|
		|   7	    	| Text3		|  25	|	
		|   8	 	| Text4		|  8	|
		
		`msg.column_name` = [];
		`msg.column_sort` = ["column1"];
		`msg.data` = [7];
		`msg.database` = "test";
		`msg.command` = "select";
		*SELECT * FROM test WHERE column1=7
		
		
	**SELECT only defined columns from Database
		
		|column1	|column2	|column3|
		|---------------|:-------------:|------:|
		|   5		| Text1    	|  452	|
		|   6		| Text2		|  24	|
		|   7	    	| *Text3*	|  25	|	
		|   8	 	| Text4		|  8	|
		
		`msg.column_name` = ["column2"];
		`msg.column_sort` = ["column1","column3"];
		`msg.data` = [7,25];
		`msg.database` = "test";
		`msg.command` = "select";
		*SELECT column2 FROM test WHERE column1='7' AND column3='25'


	**UPDATE one value in the existing records in a table
		
		|column1	|column2	|column3|
		|---------------|:-------------:|------:|
		|   5		| Text1    	|  452	|
		|   6		| Text2		| update|
		|   7	    	| Text3		| 25	|	
		|   8	 	| Text4		|  8	|
		
		`msg.column_name` = ["column3"];
		`msg.column_data` = [UPDATE];
		`msg.column_sort` = ["column1",column2];
		`msg.data` = [6,"Text2"];
		`msg.database` = "test";
		`msg.command` = "update";
		*UPDATE test SET column3='UPDATE' WHERE column1='6' AND column2='Text2'


	**DELETE existing records in a table
		
		|column1	|column2	|column3|
		|---------------|:-------------:|------:|
		|   5		| Text1    	|  452	|
		|   6		| Text2		|  125	|
		|  ** 7	    	| Text3		|  25	|	
		|   8	 	| Text4		|  8	|
		
		`msg.column_name` = [];
		`msg.column_sort` = ["column1","column2","column3"];
		`msg.data` = [6,"Text2",125];
		`msg.database` = "test";
		`msg.command` = "delete";
		*DELETE FROM test WHERE column1='6' AND column2='Text2' AND column3='125'
