var Sequence = require('../models/sequenceGenerator');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {

//   Sequence.findOne()
//     .exec(function(err, sequence) {
//       if (err) {
//         return res.status(500).json({
//           title: 'An error occurred',
//           error: err
//         });
//       }

//       sequenceId = sequence._id;
//       maxDocumentId = sequence.maxDocumentId;
//       maxMessageId = sequence.maxMessageId;
//       maxContactId = sequence.maxContactId;
//     });
// }

Sequence.findOne()
  .then(function(sequence) {
    sequenceId = sequence._id;
    maxDocumentId = sequence.maxDocumentId;
    maxMessageId = sequence.maxMessageId;
    maxContactId = sequence.maxContactId;
  })
  .catch(function(err) {
    return res.status(500).json({
      title: 'An error occurred',
      error: err
    });
  });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  Sequence.update({_id: sequenceId}, {$set: updateObject},
    function(err) {
      if (err) {
        console.log("nextId error = " + err);
        return null
      }
    });

  return nextId;
}

module.exports = new SequenceGenerator();

// var Sequence = require("../models/sequenceGenerator");

// var maxDocumentId;
// var maxMessageId;
// var maxContactId;
// var sequenceId = null;

// function SequenceGenerator() {
//   Sequence.findOne().exec(function (err, sequence) {
//     if (err) {
//       console.log("An error occurred while finding the sequence: " + err);
//     }

//     sequenceId = sequence._id;
//     maxDocumentId = sequence.maxDocumentId;
//     maxMessageId = sequence.maxMessageId;
//     maxContactId = sequence.maxContactId;
//   });
// }

// SequenceGenerator.prototype.nextId = function (collectionType) {
//   var updateObject = {};
//   var nextId;

//   switch (collectionType) {
//     case "documents":
//       maxDocumentId++;
//       updateObject = { maxDocumentId: maxDocumentId };
//       nextId = sequence.maxDocumentId;
//       break;
//     case "messages":
//       maxMessageId++;
//       updateObject = { maxMessageId: maxMessageId };
//       nextId = sequence.maxMessageId;
//       break;
//     case "contacts":
//       maxContactId++;
//       updateObject = { maxContactId: maxContactId };
//       nextId = sequence.maxContactId;
//       break;
//     default:
//       return -1;
//   }

//   Sequence.updateOne(
//     { _id: sequenceId },
//     { $set: updateObject },
//     function (err) {
//       if (err) {
//         console.log("An error occurred while updating the sequence: " + err);
//       }
//     }
//   );

//   return nextId;
// };

// module.exports = new SequenceGenerator();