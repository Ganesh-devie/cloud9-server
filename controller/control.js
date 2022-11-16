
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

  exports.addsalesorder=async(req,res)=>{
    try{
        
        res.status(200).json({
          status:'SalesOrder Added successfully',
        })
       
      }
      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }
  }

  exports.addreceipt=async(req,res)=>{
    try{
        console.log(req.body);
        con.query("Insert into receipt values (?,?,?,?,?,?,?)",[res.body.receiptNo,res.body.partyname,res.body.amount,res.body.date,res.body.mode,res.body.executive,res.body.username],function(error,result,field){
          if(error) throw error;
          if(result.length>0){
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
       
      }
      catch(err){
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