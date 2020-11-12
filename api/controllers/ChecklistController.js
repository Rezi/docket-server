/**
 * ChecklistController
 *
 * @description :: Server-side logic for managing checklists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function(req, res) {
    /*     var allowedParameters = ['email', 'password'];
    var data = _.pick(req.body, allowedParameters);
 */
    var data = req.body;
    Checklist.create(data)
      .then(function(checklist) {
        var responseData = {
          checklist: checklist
        };

        return ResponseService.json(
          200,
          res,
          'Checklist created successfully',
          responseData
        );
      })
      .catch(function(error) {
        if (error.invalidAttributes) {
          return ResponseService.json(
            400,
            res,
            'Checklist could not be created',
            error.Errors
          );
        }
      });
  },
  update: function(req, res) {
    var data = req.body;
    Checklist.update({ id: req.params.id }, data)
      .then(function(checklist) {
        sails.sockets.broadcast(
          [`checklist_${req.params.id}`],
          'checklist',
          checklist[0],
          req
        );
        var responseData = {
          checklist: checklist
        };

        return ResponseService.json(
          200,
          res,
          'Checklist updated successfully',
          responseData
        );
      })
      .catch(function(error) {
        if (error.invalidAttributes) {
          return ResponseService.json(
            400,
            res,
            'Checklist could not be updated',
            error.Errors
          );
        }
      });
  },
  findOne: function(req, res) {
    Checklist.findOne(req.params.id)
      .then(function(checklist) {
        if (req.isSocket) {
          var roomName = `checklist_${req.params.id}`;
          sails.sockets.join(req, roomName, function(err) {
            if (err) {
              return res.serverError(err);
            }

            console.log('Subscribed to a room called ' + roomName + '!');
          });
        }

        var responseData = {
          checklist: checklist
        };

        return ResponseService.json(
          200,
          res,
          'Checklist loaded successfully',
          responseData
        );
      })
      .catch(function(error) {
        if (error.invalidAttributes) {
          return ResponseService.json(
            400,
            res,
            'Checklist could not be loaded',
            error.Errors
          );
        }
      });
  }
};
