
const mysql = require('mysql2');
const con = require('../model/schema');
const http = require("http");

exports.loginauth=async(req,res)=>{
    try{
      let name=req.body.username;
      const pass=req.body.password;
      con.query('SELECT * FROM userdetails WHERE username =? AND userpass=?',[name,pass],function(error,result,field){
        if(error) throw err;
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

      con.query("insert into voucher(voucherNo,date,vouchertype,partyname,executive,username) values (?,?,?,?,?,?)",[orderno,date,"Sales Order",party,executive,user]);

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
          if(error) throw err;
          if(result.length>0){
            res.status(200).json({
              status:'already exists',
            })
          }
        
        else{
          con.query("insert into voucher(voucherNo,date,vouchertype,partyname,executive,username) values (?,?,?,?,?,?)",[req.body.receiptNo,req.body.date,"Receipt",req.body.partyName,req.body.executive,req.body.username]);
          con.query("Insert into receipt (receiptNo,partyname,amount,date,mode,executive,username) values (?,?,?,?,?,?,?)",[req.body.receiptNo,req.body.partyName,req.body.amount,req.body.date,req.body.mode,req.body.executive,req.body.username],function(error,result,field){
          if(error) throw err;
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
      con.query("Select orderNo from salesorder where username=? AND executive=?",[req.params.user,req.params.executive],function(error,result,field){
       if(error) throw err;
       if(result.length>0){
       vchno=result[result.length-1].orderNo
        res.status(200).json({
          status:'exist',
          number:vchno
        })
      }
      else{
        res.status(200).json({
          status:'no'
                })
      }
       
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
      con.query("Select receiptNo from receipt where username=? AND executive=?",[req.params.user,req.params.executive],function(error,result,field){
        if(error) throw err;
        console.log(result);
        if(result.length>0){
        vchno=result[result.length-1].receiptNo
         res.status(200).json({
           status:'exist',
           number:vchno
         })
       }
       else{
         res.status(200).json({
           status:'no'
                 })
       }
        
       })
       
      }
      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }
  }

  exports.getvoucher=async(req,res)=>{
    try{
        con.query("Select * from voucher where username=? AND date BETWEEN ? AND ? ",[req.params.user,req.params.start,req.params.end],function(error,result,field){
          if(error) throw err;
          if(result.length>0){
           res.status(200).json({
          voucher:result
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
  
  exports.extractdata=async(req,res)=>{
    try{
      let data;
      con.query("Select * from salesorder where username=? AND date BETWEEN ? AND ? ",[req.params.user,req.params.start,req.params.end],function(error,result,field){
        if(error) throw err;
        if(result.length>0){
        data=result;
        }
        else{
          data="empty";
        }
       
      });

      con.query("Select * from receipt where username=? AND date BETWEEN ? AND ? ",[req.params.user,req.params.start,req.params.end],function(error,result,field){
        if(error) throw err;
        if(result.length>0){
         res.status(200).json({
         salesorder:data,
        receipt:result
      })
        }
        else{
          res.status(200).json({
            salesorder:data,
            receipt:"empty"
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

  exports.importdata=async(req,res)=>{
    console.log(req.body.data);
      res.status(200).json({
          status: 'success',
          message: 'received'
        });
  };

  exports.invalid=async(req,res)=>{
    res.status(404).json({
        status: 'fail',
        message: 'Invalid path',
      });
};

  

