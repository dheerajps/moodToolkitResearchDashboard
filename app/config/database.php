<?php
/**
* Database config File
*/
//mysqli_report(MYSQLI_REPORT_STRICT);

class Database{

	//specify all the DB credentials
	//TODO :: should be in a config file
	private $serverName = "127.0.0.1";
	private $dbName = "test";
	private $userName = "root";
	private $password = "";

	private $connection = null;

	private function getConnection(){

		$this->connection=null;

		try{ // Create a connection
			$this->connection = new mysqli($this->serverName,$this->userName,$this->password,$this->dbName);
		}catch(Exception $e){
			echo "Unable to connect to DB :" . $this->connection->connect_error; // exception-> Connection Failed
			$this->connection = null;
			return false;
		}
		// Nothing went wrong, connected
	}

	public function executeQuery($query,$params=null){

		//TODO ::  Handle prepared statements
		$result = $this->connection->query($query);
		if ( !$result ) {
            echo "Error: ";
            return false;
        }

        //TODO :: Clean and then return may be??
        return $result;
	}

	public function closeConnection() {
            try {
                $this->connection->close();
            } catch (mysqli_sql_exception $e) {
                $this->connection = null;
            }
    }

	public function __construct() {
        $this->getConnection();
    }

}

?>