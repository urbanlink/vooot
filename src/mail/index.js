'use strict';

// Dependencies
var helper = require('sendgrid').mail;
var settings = require('../config/settings');
var sendgrid = require("sendgrid")(settings.mail.sendgridKey);

exports.send = function(data) {

  if (!data.to) {
    console.log('Error: data.to is required');
    return;
  }

  var fromEmail = new helper.Email(data.from || 'hi@vooot.nl');
  var toEmail = new helper.Email(data.to);

  // Fetch the required content
  var templateContent;
  switch (data.template) {
    case 'afterRegistration':
      templateContent = afterRegistration(data);
      break;
    case 'afterActivation':
      templateContent = afterActivation(data);
      break;
    case 'resendActivationKey':
      templateContent = resendActivationKey(data);
      break;
    case 'forgotPassword':
      templateContent = forgotPassword(data);
      break;
    case 'afterPasswordChanged':
      templateContent = afterPasswordChanged(data);
      break;
    default:
      console.log('mail hook not found');
      return;
  }
  console.log(templateContent);
  var subject = templateContent.subject || data.subject || 'Een bericht van voOot! ';

  var content = new helper.Content('text/html', templateContent.html);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
  mail.setTemplateId('537f42ab-394b-40a7-a2fa-570deedde075');

  var request = sendgrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sendgrid.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

// Sending an email after registration. Welcome and activationlink
function afterRegistration(data) {

  var out = {};
  out.subject = "Welkom bij voOot!";

  var html = '';
  html += '<p>Welkom bij voOot!</p><br>';
  html += '<p>Jouw account op vooot.nl is succesvol aangemaakt. Om gebruik te maken van voOot is activatie van je account nodig. Doe dit via deze button:</p>';

  html += '<p style="text-align:center; margin:30px"><a href="'+settings.domain+'/account/activate?key=' + data.key + '" style="background-color:#1FC0B9;border:1px solid #333333;border-color:#1FC0B9;border-radius:2px;border-width:1px;color:#ffffff;display:inline-block;font-family:arial,helvetica,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none; target="_blank">Account activeren</a></p>';

  html += '<p>Werkt bovenstaande knop niet? Kopieer dan deze link in je browser: <br><a href="'+settings.domain+'/account/activate?key=' + data.key + '">'+settings.domain+'/account/activate?key='+data.key+'</a><br>';
  html += '<p>Of maak gebruik van de API met de activatiesleutel: ' + data.key + '</p>';

  out.html = html;

  return out;
}

function afterActivation(data) {
  var out = {};
  out.subject = "Je account bij voOot is geactiveerd!";

  var html = '';
  html += '<p>Welkom bij voOot!</p><br>';
  html += '<p>Jouw account op vooot.nl is geactiveerd. Je kunt nu inloggen en gebruik maken van voOot! </p>';

  html += '<p style="text-align:center; margin:30px"><a href="'+settings.domain+'" style="background-color:#1FC0B9;border:1px solid #333333;border-color:#1FC0B9;border-radius:2px;border-width:1px;color:#ffffff;display:inline-block;font-family:arial,helvetica,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none; target="_blank">Naar voOot</a></p>';

  out.html = html;

  return out;
}

function resendActivationKey(data) {
  var out = {};
  out.subject = "Nieuwe activatie code";

  var html = '';
  html += '<p>Er is een nieuwe activatie-code aangevraagd voor voOot. Doe dit via deze button:</p>';

  html += '<p style="text-align:center; margin:30px"><a href="'+settings.domain+'/account/activate?key=' + data.key + '" style="background-color:#1FC0B9;border:1px solid #333333;border-color:#1FC0B9;border-radius:2px;border-width:1px;color:#ffffff;display:inline-block;font-family:arial,helvetica,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none; target="_blank">Account activeren</a></p>';

  html += '<p>Werkt bovenstaande knop niet? Kopieer dan deze link in je browser: <br><a href="'+settings.domain+'/account/activate?key=' + data.key + '">'+settings.domain+'/account/activate?key='+data.key+'</a><br>';
  html += '<p>Of maak gebruik van de API met de activatiesleutel: ' + data.key + '</p>';

  out.html = html;

  return out;
}

function forgotPassword(data) {
  var out = {};
  out.subject = "Wachtwoord wijzigen";

  var html = '';
  html += '<p>Er is een nieuw wachtwoord aangevraagd voor voOot. Doe dit via deze key:</p>';
  html += '<p style="text-align:center; margin:30px">'+ data.key + '</p>';
  html += '<p>gebruik de API met een POST request naar /account/change-password met bovenstaande key in de body.</p>';

  out.html = html;

  return out;
}

function afterPasswordChanged(data) {
  var out = {};
  out.subject = "Wachtwoord gewijzigd";

  var html = '';
  html += '<p>Je wachtwoord voor voOot is gewijzigd.</p>';

  out.html = html;

  return out;
}
