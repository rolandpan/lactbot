//
// LactBot
// - onboard to LactApp
//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//
//

import {Dialog, NLPModel,log} from 'deepdialog';

const CURRENT_VERSION='2017-05-26-main';
const restartPath = ['menu','Como este','menu','Vale, cuéntame','menu','Ok'];

export const UNRECOGNIZED_IMAGE_RESPONSE = `I\'m so sorry, but I\'m still working on recognizing stickers and images...until I figure it out its best to use text with me.`;
export const UNRECOGNIZED_TEXT_RESPONSE = `I\'m sorry, but I didn't understand `;
export const CHOOSE_MENU_ITEM_RESPONSE = `Please choose a menu item.`;
export const COMPLETION_QUESTIONAIRE='2017-05-26-completion';
export const HELP_MENU_TREE = '2017-05-26-help';
export const MainNLP = new NLPModel({
  name: 'MainNLP',
  provider:'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

export const MainDialog = new Dialog({
  name: 'MainDialog',
  description: 'The top level dialog of your bot'
});

MainDialog.nlpModelName = 'MainNLP';

MainDialog.onStart(async function (session) {
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION});
});

MainDialog.onText('Empezar', async function(session) {
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION});
});

MainDialog.onResult('MenuTreeDialog', 'current', async function(session) {
  await session.start('MenuTreeDialog', 'completion_questionaire', {versionName: COMPLETION_QUESTIONAIRE} );
});

MainDialog.onResult('MenuTreeDialog', 'completion_questionaire', async function(session, result) {
  if (result) await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION, path: restartPath});
});

//
// Basic intent handlers
//
MainDialog.onIntent('image_input', async function (session, {entities}, {message}) {
  if (imageHandler(session, message)) {
    await session.send('Bueno!');
  }
  else {
    await session.send({text: UNRECOGNIZED_IMAGE_RESPONSE});
  }
});

MainDialog.onRecovery(async function (session) {
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION});
});

function imageHandler(session, message) {
  //
  // thumbs up icons
  //
  var thumbsUp =
    [
      'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=65f8806bcfe45834eb50b60f51cb352d&oe=596142DC',
      'add thumbs up urls here'
    ];

  if (thumbsUp.indexOf(message.text) > -1 ) {
    return true;
  }
  else {
    return false;
  }
}
