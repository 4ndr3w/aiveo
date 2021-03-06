/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var tvdb = require("../../cachedTVDB"),
    bcrypt = require("bcrypt");

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

  logout: function(req,res)
  {
	  req.session.user = false;
	  res.redirect("/");
  },

  viewuser: function(req, res)
  {
	  User.findOneByUsername(req.param("username"), function(err, user)
	  {
		  if ( !err && user )
		  {
			  Library.findByUser(user.id).populate("series").exec(function (err, userLibrary)
			  {
          res.view({title:req.param("username"), username: req.param("username"),library: userLibrary, session: req.session});
			  });
      }
		  else
			  res.view('404');
	  });
  },

  managefriends: function(req, res)
  {
	  User.findOneById(req.session.user.id).exec(function(err,user)
	  {
		  if ( req.param("newfriend") )
		  {
			  var fail = false;
			  for ( f in user.friends )
			  {
				  if ( req.param("newfriend") == user.friends[f] )
				  {
					  fail = true;
				  }
			  }

			  if ( req.param("newfriend") == req.session.user.username )
			  	fail = true;

			  if ( fail )
			  {
				  res.view({title:"Friends", session: req.session, friends:user.friends});
				  return;
			  }

			  User.findOneByUsername(req.param("newfriend")).exec(function(err, newfriend)
			  {
				  if ( err || newfriend == undefined )
				  {
				 	 res.view({title:"Friends", session: req.session, friends:user.friends});
					 return;
				  }
				  if ( user.friends == undefined )
				  	user.friends = new Array();
				  user.friends.push(req.param("newfriend"));
				  user.save(function(err)
				  {
					  res.view({title:"Friends", session: req.session, friends:user.friends});
				  });
			  });
		  }
		  else if ( req.param("deletefriend") )
		  {
			  newArray = new Array();
			  for ( f in user.friends )
			  {
				  if ( req.param("deletefriend") != user.friends[f] )
				  	newArray.push(user.friends[f]);
			  }
			  user.friends = newArray;
			  user.save(function(err)
			  {
				  res.redirect("/friends/manage");
			  });
		  }
		  else
	  	  	res.view({title:"Friends", session: req.session, friends:user.friends});
	  });
  },

  changepassword: function(req,res)
  {
    if ( req.param("changepassword") && req.param("oldpassword") && req.param("newpassword") && req.param("newpassword") == req.param("newpassword2") )
    {
      User.findOneById(req.session.user.id).exec(function(err, user)
      {
        user.validate(req.param("oldpassword"), function (err, valid)
        {
          if ( valid )
          {
            bcrypt.hash(req.param("newpassword"), bcrypt.genSaltSync(10), function(err, hash)
            {
              user.password = hash;
              user.save(function(err)
              {
                res.redirect("/");
              });
            });
          }
          else
            res.view({title: "Change Password"});
        });


      });
    }
    else
      res.view({title: "Change Password"});
    }

};
