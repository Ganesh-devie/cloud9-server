
const mysql = require('mysql2');
const con = require('../model/schema');

exports.loginauth=async(req,res)=>{
    try{
      let name=req.body.username;
      const pass=req.body.password;
      con.query('SELECT * FROM userdetails WHERE username =? AND userpass=?',[name,pass],function(error,result,field){
        if(error) throw error;
        if(result.length>0){
        res.status(200).json({
         status : 'valid',
         result,
        })
      }
      else{
        res.status(200).json({
          status:'invalid',
        })
      }
      });
      
     
    }
    catch(err){
      res.status(404).json({
          status:'fail',
          message:err,
      });
    }
  };

  exports.addsalesorder=function (req, res) {
    try {
      let invitem = req.body.inventoryEntries;
      let orderno = req.body.orderNo;
      let date = req.body.date;
      let executive = req.body.executive;
      let user = req.body.username;
      let party = req.body.partyName;
      let count = 0;

      for (i = 0; i < invitem.length; i++) {
        let itemno = invitem[i].sno;
        let partno = invitem[i].partno;
        let stk = invitem[i].stockitemname;
        let qty = invitem[i].qty;
         con.query("insert into salesorder(orderNo,partyname,date,executive,username,partNo,stockname,quantity,itemno) values (?,?,?,?,?,?,?,?,?)", [orderno, party, date, executive, user, partno, stk, qty, itemno]);
        count++;
      }

      if (count === invitem.length) {
        res.status(200).json({
          status: 'valid',
        });
      }

      else {
        res.status(200).json({
          status: 'invalid',
        });
      }
    }
    catch (err) {
      console.log(err);
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  }

  exports.addreceipt=async(req,res)=>{
    try{
         con.query("Select * from receipt where receiptNo=? AND partyName=? AND amount=? AND date=? AND mode=? AND executive=? AND username=?",[req.body.receiptNo,req.body.partyName,req.body.amount,req.body.date,req.body.mode,req.body.executive,req.body.username],function(error,result,field){
          if(error) throw error;
          if(result.length>0){
            res.status(200).json({
              status:'already exists',
            })
          }
        
        else{
          con.query("Insert into receipt values (?,?,?,?,?,?,?)",[req.body.receiptNo,req.body.partyName,req.body.amount,req.body.date,req.body.mode,req.body.executive,req.body.username],function(error,result,field){
          if(error) throw error;
          console.log(result);
          if(result.affectedRows===1){
           res.status(200).json({
          status:'valid',
        })
          }
          else{
            res.status(200).json({
              status:'invalid',
            })
          }
      });
    }});
      }
      catch(err){
        console.log(err);
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }
  }

  exports.getsalesorder=async(req,res)=>{
    try{
        
        res.status(200).json({
          status:'SalesOrder fetched',
        })
       
      }
      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }
  }

  exports.getreceipt=async(req,res)=>{
    try{
        
        res.status(200).json({
          status:'receipt fetched',
        })
       
      }
      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }
  }
  
  exports.invalid=async(req,res)=>{
      res.status(404).json({
          status: 'fail',
          message: 'Invalid path',
        });
  };