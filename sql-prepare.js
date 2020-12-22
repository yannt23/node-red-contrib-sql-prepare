module.exports = function(RED) {

function sqlprepare(config) {
    RED.nodes.createNode(this,config);
    // node-specific code goes here
	var node = this;
        node.on('input', function(msg, send, done) {
    // Check the msg data input
	
	
	var length_column_name = msg.column_name.length-1;
	var length_column_sort = msg.column_sort.length-1;
	var database = msg.database;
	var spalten = [];
	var data = [];
	var data2 = [];
	var sql;
	var ende = length_column_name;
	var ende_payload = length_column_sort;
	var insert;
	var insert2;
	var outputs=[];
	var output;
	var err;

		if (msg.command== "select") 
		{ 
            if (msg.data.length < msg.column_sort.length)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.data has not the same length then msg.column_sort"});
				err = "msg.data has not the same length then msg.column_sort";
				node.error(err);
				
			}
			else
			{
				if (msg.column_name.length === 0)
				{
					
						if(msg.column_sort.length === 0)
						    {
						        sql = "Select * FROM "+database; //Select all
						        data.push(sql);
					        	insert = data.toString();
						        insert2 ="";
						    }
						else
						    {
							    for (var j=0; j <= length_column_sort; j++) 
							    {
								    if (j=== 0)
								    {
								        sql = "SELECT * FROM "+ database;
								        sql2 = " WHERE "+msg.column_sort[0]+"='"+msg.data[0]+"'";
								        data.push(sql);
								        data2.push(sql2);    
								    }
								    else if (j != ende_payload && j != 0)
								    {

								        values = msg.column_sort[j];
								        sql2 = " AND "+values+"='"+msg.data[j]+"'";
								        data2.push(sql2);
								    }
								    else if (j == ende_payload)
								    {	
								        values = msg.column_sort[j];
								        sql2 = " AND "+values+"='"+msg.data[j]+"'";
								        data2.push(sql2);
								    }
				    
							    insert = data.toString();
							    insert2 = data2.join("");
							    }
						    }

					output = insert+insert2;
				
					// Status                                                                                                                                                                                                                    Beschreibung:                              
					var d = new Date();
					var yyyy = d.getFullYear();
					var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); 
					var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
					var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
					var mmm  = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
					var ss  = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
					node.status({fill:"green",shape:"ring",text:"Last update: "+dd + "." + mm + "." + yyyy + " " + hh + ":" + mmm + ":" + ss});
				    }
		
				else
				{
					for (var j=0; j <= length_column_name; j++)
					{
						if (j=== 0)
						{
							sql = "SELECT "+msg.column_name[0];
							sql2 = " WHERE "+msg.column_sort[0]+"='"+msg.data[0]+"'";
							data.push(sql);
							data2.push(sql2);    
						}
						else if (j != ende && j != 0)
						{
							column = msg.column_name[j];
							values = msg.column_sort[j];
							sql = column;
							data.push(sql);
				
							sql2 = " AND "+values+"='"+msg.data[j]+"'";
							data2.push(sql2);
						}
						else if (j == ende)
						{	
							column = msg.column_name[j];
							sql = column+" FROM "+database;
							data.push(sql);
					
							values = msg.column_sort[j];
							sql2 = " AND "+values+"='"+msg.data[j]+"'";
							data2.push(sql2);
						}
					}
	
					insert = data.toString();
					insert2 = data2.join("");
					output = insert+insert2;
				}
	 outputs.push({topic:output});
					
			}			
	}

        else if (msg.command== "update") 
		{
			if (msg.data.length != msg.column_sort.length)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.data has not the same length then msg.column_sort"});
				err = "msg.data has not the same length then msg.column_sort";
				node.error(err);	
			}
			else if (msg.column_name.length != 1)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.column_name has no or more than one column set"});
				err = "msg.column_name has no or more than one column set";
				node.error(err);
			}
			else if (msg.column_data === undefined || msg.column_data.length != 1)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.column_data has no or more than one column set"});
				err = "msg.column_data has no or more than one column set";
				node.error(err);
			}
			else if (msg.database === undefined)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.database is not defined"});
				err = "msg.database is not defined";
				node.error(err);
			}
			
			else
			{
				for (var j=0; j <= length_column_sort; j++) 
				{
					if (j=== 0)
					{
						sql = "UPDATE "+database+" SET "+msg.column_name[0]+"='"+msg.column_data[0]+"'"; 
						data.push(sql);
						sql2 = " WHERE "+msg.column_sort[0]+"='"+msg.data[0]+"'";  
						data2.push(sql2);
					}
					else if (j != ende_payload && j != 0)
					{
						sql2 = " AND "+msg.column_sort[j]+"='"+msg.data[j]+"'";  
						data2.push(sql2);
					}
					else if (j == ende_payload)
					{	
						sql2 = " AND "+msg.column_sort[j]+"='"+msg.data[j]+"'";  
						data2.push(sql2);
					}
					insert = data.toString();
					insert2 = data2.join("");
					output = insert+insert2;
				}
				outputs.push({topic:output});
		
				// Status                                                                                                                                                                                                                    Beschreibung:                              
				var d = new Date();
				var yyyy = d.getFullYear();
				var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); 
				var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
				var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
				var mmm  = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
				var ss  = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
				node.status({fill:"green",shape:"ring",text:"Last update: "+dd + "." + mm + "." + yyyy + " " + hh + ":" + mmm + ":" + ss});
			}
		}
        else if (msg.command== "delete") 
		{
			if (msg.data.length != msg.column_sort.length)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.data has not the same length then msg.column_sort"});
				err = "msg.data has not the same length then msg.column_sort";
				node.error(err);
			}
			else if (msg.database === undefined)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.database is not defined"});
				err = "msg.database is not defined";
				node.error(err);
			}
			else
			{
				for (var j=0; j <= length_column_sort; j++) 
				{
					if (j=== 0)
					{
						sql = "DELETE FROM "+database; 
						data.push(sql);
						sql2 = " WHERE "+msg.column_sort[0]+"='"+msg.data[0]+"'";  
						data2.push(sql2);
					}
					else if (j != ende_payload && j != 0)
					{
						sql2 = "AND "+msg.column_sort[j]+"='"+msg.data[j]+"'";  
						data2.push(sql2);
					}
					else if (j == ende_payload)
					{	
						sql2 = "AND "+msg.column_sort[j]+"='"+msg.data[j]+"'";  
						data2.push(sql2);
					}
		
	
				insert = data.toString();
				insert2 = data2.join("");
				output = insert+insert2;
				}
			outputs.push({topic:output});
		
			// Status                                                                                                                                                                                                                    Beschreibung:                              
				var d = new Date();
				var yyyy = d.getFullYear();
				var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); 
				var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
				var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
				var mmm  = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
				var ss  = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
				node.status({fill:"green",shape:"ring",text:"Last update: "+dd + "." + mm + "." + yyyy + " " + hh + ":" + mmm + ":" + ss});

			}
		}
		else
		{
			if (msg.column_name.length != msg.column_sort.length)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.column_name has not the same length then msg.column_sort"});
				err = "msg.column_name has not the same length then msg.column_sort";
				node.error(err);
			}
			else if (msg.database === undefined)
			{
				node.status({fill:"red",shape:"dot",text:"ERROR: msg.database is not defined"});
				err = "msg.database is not defined";
				node.error(err);
			}
			else
			{
				if (length_column_name == length_column_sort)
				{
					for (var j=0; j <= length_column_name; j++) 
					{
						if (j=== 0)
						{
							sql = "INSERT INTO "+database+" ("+msg.column_name[0];
							sql2 = "VALUES ('"+msg.column_sort[0]+"'";
							data.push(sql);
							data2.push(sql2);    
						}
				
						else if (j != ende && j != 0)
						{
							spalten = msg.column_name[j];
							values = msg.column_sort[j];
							sql = spalten;
							data.push(sql);
				
							sql2 = "'"+values+"'";
							data2.push(sql2);
						}
						else if (j == ende)
						{	
							spalten = msg.column_name[j];
							sql = spalten+") ";
							data.push(sql);
					
							values = msg.column_sort[j];
							sql2 = "'"+values+"')";
							data2.push(sql2);
						}
					}
					insert = data.toString();
					insert2 = data2.toString();
					output = insert+insert2;
				}
				outputs.push({topic:output});
		
				// Status                                                                                                                                                                                                                    Beschreibung:                              
				var d = new Date();
				var yyyy = d.getFullYear();
				var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); 
				var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
				var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
				var mmm  = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
				var ss  = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
				node.status({fill:"green",shape:"ring",text:"Last insert: "+dd + "." + mm + "." + yyyy + " " + hh + ":" + mmm + ":" + ss});

		}
	}

if (output === undefined)
{
	this.warn("Wrong insert of data, check if the msg. is correct defined");
}




	
	

        
        
  
  
	node.send(outputs);
    
    // Once finished, call 'done'.
    // This call is wrapped in a check that 'done' exists
    // so the node will work in earlier versions of Node-RED (<1.0)
    if (done) {
        done();
    }
});
	}

RED.nodes.registerType("sql-prepare",sqlprepare);
}
