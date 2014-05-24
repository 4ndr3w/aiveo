/**
 * WelcomeController
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

var bcrypt = require("bcrypt");

module.exports = {
    
    create: function(req,res)
    {
  	  if ( req.param("password") == req.param("password2") )
  	  {
  	  	User.create({username:req.param("username"), password:req.param("password"), email:req.param("email")}).exec(function(err, obj)
  		{
  			if ( !err && obj )
			{
				req.session.user = obj;
				res.redirect("/");
			}
			else
				res.view("welcome/register", {template: "welcome/register", layout:"", noPasswordMatch: false, noUniqueUsername: true});
  		});
  	  }
  	  else
  	 	res.view("welcome/register", {template: "welcome/register", layout:"", noPasswordMatch: true, noUniqueUsername: false});
    },
	
    authenticate: function(req,res)
    {
	  User.findOneByUsername(req.param("username"), function(err, user)
	  {
		  if ( user )
		  {
			  bcrypt.compare(req.param("password"), user.password, function(err, isCorrect)
			  {
				  if ( isCorrect )
				  	req.session.user = user;
				  res.redirect("/")
			  });
		  }
		  else
		  	res.redirect("/")
	  });
    },
	
	index: function(req,res)
	{
		res.view({
			layout: ""
		})
	},
	
	register: function(req,res)
	{
		res.view({layout:"", noPasswordMatch: false, noUniqueUsername: false});
	},
  
  

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to WelcomeController)
   */
  _config: {}

  
};
