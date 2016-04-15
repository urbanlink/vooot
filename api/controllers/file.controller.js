'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var path = require('path');

// error handler
function handleError(res, err) {
  console.log('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// File index
exports.index = function(req,res) {
  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 50; }
  var offset = req.query.offset || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};

  models.File.findAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return res.json({err:err});
  });

};

exports.show = function(req,res) {
  var fs = require('fs');
  var PDFParser = require('pdf2json/PDFParser');
  var pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", function(errData) {
   return res.json(errData);
  });

  pdfParser.on("pdfParser_dataReady", function(pdfData) {
    res.json(pdfData);
  });
  
  pdfParser.loadPDF(path.join(settings.root, 'files/2.pdf'));
  // models.File.findOne({
  //   where: { id: req.params.id }
  // }).then(function(event){
  //   return res.json(event);
  // });
};

exports.create = function(req,res){
  models.File.create(req.body).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    handleError(res,err);
  });
};

exports.update = function(req,res){
  models.File.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};

exports.destroy = function(req,res){
  models.File.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};
