/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');

module.exports = {
  create: function(req, res) {
    if (req.body.password !== req.body.passwordConfirmation) {
      return ResponseService.json(401, res, "Password doesn't match");
    }

    var allowedParameters = ['email', 'password', 'checklists'];

    var data = _.pick(req.body, allowedParameters);

    User.create(data)
      .then(function(user) {
        var responseData = {
          user: user,
          token: JwtService.issue({ id: user.id })
        };

        return ResponseService.json(
          200,
          res,
          'User created successfully',
          responseData
        );
      })
      .catch(function(error) {
        if (error.invalidAttributes) {
          return ResponseService.json(
            400,
            res,
            'User could not be created',
            error.Errors
          );
        }
      });
  },
  updateVisitedChecklists: function(req, res) {
    var checklistId = req.body.checklistId;
    User.findOne({ id: req.params.id })
      .then(function(user) {
        if (!user.checklists.includes(checklistId)) {
          user.checklists.push(checklistId);
          data = { checklists: user.checklists };

          User.update({ id: req.params.id }, data)
            .then(function(user) {
              var responseData = {
                user: user
              };

              return ResponseService.json(
                200,
                res,
                'User updated successfully',
                responseData
              );
            })
            .catch(function(error) {
              if (error.invalidAttributes) {
                return ResponseService.json(
                  400,
                  res,
                  'User could not be updated',
                  error.Errors
                );
              }
            });
        } else {
          var responseData = {
            user: user
          };
          return ResponseService.json(
            200,
            res,
            'No User update needed',
            responseData
          );
        }
      })
      .catch(function(err) {
        return ResponseService.json(400, res, 'No user to update');
      });
  },
  getUsersChecklists: function(req, res) {
    var userId = req.params.id;
    User.findOne({ id: userId })
      .then(function(user) {
        Checklist.find()
          .where({
            id: user.checklists
          })
          .exec(function(err, checklists) {
            if (err) {
              return ResponseService.json(
                400,
                res,
                'Checklists by user cannot be found',
                error.Errors
              );
            }
            let checklistsSimple = _.map(checklists, function(checklist) {
              return { id: checklist.id, title: checklist.title };
            });

            var responseData = {
              checklists: checklistsSimple
            };
            return ResponseService.json(
              200,
              res,
              'Checklists found',
              responseData
            );
          });
      })
      .catch(function(err) {
        return ResponseService.json(400, res, 'Cannot find user');
      });
  }
};
