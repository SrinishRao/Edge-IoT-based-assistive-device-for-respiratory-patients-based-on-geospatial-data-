const dBConnection = require('./ConnectionPooling');

module.exports = class LoginSignupDao {
 
    async createNewUser(inputData){
        let con = await dBConnection();
        try {
            await con.query('INSERT INTO User SET ?', [inputData]);
            await con.query("COMMIT");
            let result = await con.query('SELECT * FROM User WHERE email = ? AND password = ?', [inputData.email, inputData.password]);
            //console.log(result);
            let userid= result[0].id;
            return userid;
          } catch (ex) {
            await con.query("ROLLBACK");
           throw ex;
          } finally {
            await con.release();
            await con.destroy();
          }
    }
    async saveAirQualityData(inputData){
      let con = await dBConnection();
      try {
          await con.query('INSERT into AirQualityData2 SET ?', [inputData]);
          await con.query("COMMIT");
          //let result = await con.query('SELECT * FROM AirQualityData2 WHERE id = 1');
          //console.log(result);
          return 1;
        } catch (ex) {
          await con.query("ROLLBACK");
         throw ex;
        } finally {
          await con.release();
          await con.destroy();
        }
  }
  
  async login(email,password) {
      let con = await dBConnection();
      try {
         let result = await con.query('SELECT * FROM User WHERE email = ? AND password = ?', [email, password]);
          await con.query("COMMIT");
          result = JSON.parse(JSON.stringify(result));
          return result;
        } catch (ex) {
          console.log(ex);
          throw ex;
        } finally {
          await con.release();
          await con.destroy();
        }
      }

      async getAirQualityData(){
        let con = await dBConnection();
        try {
            let result = await con.query('SELECT * FROM AirQualityData2 WHERE id = 1');
            await con.query("COMMIT");
             result = JSON.parse(JSON.stringify(result));
            return result;
          } catch (ex) {
            console.log(ex);
            throw ex;
          } finally {
            await con.release();
            await con.destroy();
          }
    }
    }
   

      