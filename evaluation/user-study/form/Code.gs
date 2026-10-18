/**
 * CultureLens user-evaluation form generator, version 2 (report Sections 3.7
 * and 3.8, Appendix B).
 *
 * Creates the Google Form for the per-view tasks, the counterbalanced word
 * cloud vs bar chart comparison (RQ4), the SUS, the coherence items, the
 * forced ranking and the open questions.
 *
 * How to use
 *   1. Run `npm run stimuli` in evaluation/. It writes Tasks.gs next to this
 *      file with the C1-C3 tasks for both country pairs.
 *   2. Upload the word-cloud screenshots and the generated bar-chart PNGs to
 *      Google Drive and paste their file IDs into CONFIG.images below. Paste
 *      the tutorial-video links into CONFIG.tutorials.
 *   3. At script.google.com create a new project, add Code.gs and Tasks.gs,
 *      and run createForm(). The form's edit and response URLs are logged.
 *
 * The question titles defined here are the column headers of the response
 * export, and user-study/analysis/config.json matches on them. If you change
 * a title, change it there too.
 *
 * Layout and routing
 *   Profile -> six view sections -> routing question (birth day odd/even)
 *     odd  -> Group A: word cloud on pair 1, then bar chart on pair 2
 *     even -> Group B: bar chart on pair 1, then word cloud on pair 2
 *   -> format preference -> SUS -> coherence -> ranking and open questions
 */

var CONFIG = {
  title: 'CultureLens evaluation',
  // As in the form that was used (report Appendix B), there is no separate
  // information or consent page: the form opens with the profile section.
  description: '',
  appUrl: 'https://PASTE-APP-URL-HERE',
  tutorials: {
    'Map View': '',
    'Analytics': '',
    'Parallel Sets': '',
    'Cluster Analysis': '',
    'Network Graph': '',
    'Text Analysis': '',
  },
  // Google Drive file IDs of the stimulus images.
  images: {
    P1: { cloud: '', bar: '' },
    P2: { cloud: '', bar: '' },
  },
};

var VIEWS = ['Map View', 'Analytics', 'Parallel Sets', 'Cluster Analysis', 'Network Graph', 'Text Analysis'];

// Per-view tasks (report Table 4).
var VIEW_TASKS = {
  'Map View': 'Which country has the most "highly influential" stakeholders, and how many?',
  'Analytics': 'How many instruments are at the "implementation" stage?',
  'Parallel Sets': 'With columns Type and Impact/Influence, how many "law" entries are "binding"?',
  'Cluster Analysis': 'How many stakeholders are in the "administration" cluster (by Actor Type)?',
  'Network Graph': 'How many steps from BMBF to Diakonie Deutschland?',
  'Text Analysis': 'Ignoring "itc", what is the largest word for Germany and for New Zealand?',
};

var AGREE = ['Strongly disagree', 'Strongly agree'];

var SUS_ITEMS = [
  'I think that I would like to use this system frequently.',
  'I found the system unnecessarily complex.',
  'I thought the system was easy to use.',
  'I think that I would need the support of a technical person to be able to use this system.',
  'I found the various functions in this system were well integrated.',
  'I thought there was too much inconsistency in this system.',
  'I would imagine that most people would learn to use this system very quickly.',
  'I found the system very cumbersome to use.',
  'I felt very confident using the system.',
  'I needed to learn a lot of things before I could get going with this system.',
];

function createForm() {
  if (typeof RQ4_TASKS === 'undefined') {
    throw new Error('Tasks.gs is missing: run `npm run stimuli` and add the generated Tasks.gs to this project.');
  }
  var form = FormApp.create(CONFIG.title);
  if (CONFIG.description) form.setDescription(CONFIG.description);
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  // ── Profile ───────────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('About you');
  form.addMultipleChoiceItem()
    .setTitle('What is your role?')
    .setChoiceValues(['Student', 'Researcher', 'INTRACOMP partner', 'Public sector', 'NGO'])
    .showOtherOption(true)
    .setRequired(true);
  // Report Section 5.6 reports "not familiar" and "very familiar" counts; the
  // middle label is a reconstruction - check it against the original form.
  form.addMultipleChoiceItem()
    .setTitle('How familiar are you with the ITC policy-mapping data?')
    .setChoiceValues(['Not familiar', 'Somewhat familiar', 'Very familiar'])
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('How often do you use charts, maps or network diagrams?')
    .setChoiceValues(['Often', 'Sometimes', 'Rarely'])
    .setRequired(true);

  // ── One section per view ──────────────────────────────────────────────────
  VIEWS.forEach(function (view) {
    form.addPageBreakItem()
      .setTitle(view)
      .setHelpText('Open CultureLens (' + CONFIG.appUrl + '), watch the tutorial and then answer the task using the ' + view + '.');
    if (CONFIG.tutorials[view]) {
      form.addSectionHeaderItem().setTitle('Tutorial: ' + view).setHelpText(CONFIG.tutorials[view]);
    }
    form.addTextItem().setTitle(view + ': ' + VIEW_TASKS[view]).setRequired(true);
    addTime(form, view + ': About how long did the task take you (in seconds)?');
    addScale(form, view + ': How easy was the task?', 'Very difficult', 'Very easy');
    addScale(form, view + ': How confident are you in your answer?', 'Not at all confident', 'Very confident');
    addScale(form, view + ': I could use this view again without training.', AGREE[0], AGREE[1]);
    addScale(form, view + ': This view gave me an accurate picture of the data.', AGREE[0], AGREE[1]);
    form.addMultipleChoiceItem()
      .setTitle(view + ': Did this view show you anything a spreadsheet would not?')
      .setChoiceValues(['Yes', 'No', 'Not sure'])
      .setRequired(true);
  });

  // ── Routing and RQ4 sections ──────────────────────────────────────────────
  var routingPage = form.addPageBreakItem()
    .setTitle('Word cloud vs bar chart')
    .setHelpText('The next part compares two ways of showing word frequencies. Answer from the image only; do not use the application.');
  var routing = form.addMultipleChoiceItem()
    .setTitle('Is the day of the month on which you were born odd or even?')
    .setHelpText('This only decides which version of the next questions you see.')
    .setRequired(true);

  var a1 = addComparisonSection(form, 'A1', 'P1', 'cloud', true);
  var a2 = addComparisonSection(form, 'A2', 'P2', 'bar', false);
  var b1 = addComparisonSection(form, 'B1', 'P1', 'bar', true);
  var b2 = addComparisonSection(form, 'B2', 'P2', 'cloud', false);

  routing.setChoices([
    routing.createChoice('Odd', a1),
    routing.createChoice('Even', b1),
  ]);

  // ── Format preference ─────────────────────────────────────────────────────
  var prefPage = form.addPageBreakItem().setTitle('Format preference');
  // Group A finishes at the end of A2 and must skip Group B's sections. The
  // page break that starts B1 controls where A2 goes next.
  b1.setGoToPage(prefPage);
  form.addMultipleChoiceItem()
    .setTitle('Which format would you prefer for an overview of the themes?')
    .setChoiceValues(['Word cloud', 'Bar chart', 'No preference'])
    .setRequired(true);
  form.addParagraphTextItem().setTitle('Why? (overview of themes)');
  form.addMultipleChoiceItem()
    .setTitle('Which format would you prefer for comparing word frequencies?')
    .setChoiceValues(['Word cloud', 'Bar chart', 'No preference'])
    .setRequired(true);
  form.addParagraphTextItem().setTitle('Why? (comparing frequencies)');

  // ── SUS ───────────────────────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('CultureLens as a whole')
    .setHelpText('Please rate CultureLens as a whole (all six views).');
  SUS_ITEMS.forEach(function (item, i) {
    addScale(form, 'SUS ' + (i + 1) + ': ' + item, AGREE[0], AGREE[1]);
  });

  // ── Coherence ─────────────────────────────────────────────────────────────
  addScale(form, 'Moving between the views felt consistent.', AGREE[0], AGREE[1]);
  addScale(form, 'Exploring the same data through several views helped me understand it.', AGREE[0], AGREE[1]);

  // ── Ranking and open questions ────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Ranking and final questions');
  form.addGridItem()
    .setTitle('Rank the six views by usefulness (1 = most useful, 6 = least useful).')
    .setRows(VIEWS)
    .setColumns(['1', '2', '3', '4', '5', '6'])
    .setValidation(FormApp.createGridValidation().requireLimitOneResponsePerColumn().build())
    .setRequired(true);
  [['fastest to use', 'Which view was fastest to use?'],
   ['most difficult', 'Which view was most difficult?'],
   ['most enjoyable', 'Which view was most enjoyable?']].forEach(function (q) {
    form.addMultipleChoiceItem().setTitle(q[1]).setChoiceValues(VIEWS).setRequired(true);
    form.addParagraphTextItem().setTitle('Why was that view ' + q[0] + '?');
  });

  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Response URL: ' + form.getPublishedUrl());
  return form;
}

/**
 * One RQ4 section: the stimulus image for `pair` in `format`, tasks C1-C3,
 * then time, ease and confidence. The first format a participant sees also
 * asks for a one-sentence summary of the difference between the countries.
 * Returns the section's PageBreakItem.
 */
function addComparisonSection(form, sectionId, pair, format, isFirst) {
  var t = RQ4_TASKS[pair];
  var label = format === 'cloud' ? 'Word cloud' : 'Bar chart';
  var page = form.addPageBreakItem()
    .setTitle(label + ': ' + t.countries[0] + ' vs ' + t.countries[1])
    .setHelpText('Answer the questions using only the image below.');
  var fileId = CONFIG.images[pair][format];
  if (fileId) {
    form.addImageItem().setImage(DriveApp.getFileById(fileId).getBlob()).setTitle(label);
  } else {
    form.addSectionHeaderItem().setTitle('[Image missing: set CONFIG.images.' + pair + '.' + format + ']');
  }
  var prefix = '[' + sectionId + '] ';
  form.addTextItem().setTitle(prefix + 'C1: ' + t.c1.question).setRequired(true);
  form.addMultipleChoiceItem().setTitle(prefix + 'C2: ' + t.c2.question).setChoiceValues(t.c2.options).setRequired(true);
  form.addMultipleChoiceItem().setTitle(prefix + 'C3: ' + t.c3.question).setChoiceValues(t.c3.options).setRequired(true);
  addTime(form, prefix + 'About how long did these three questions take you in total (in seconds)?');
  addScale(form, prefix + 'How easy were these questions with this format?', 'Very difficult', 'Very easy');
  addScale(form, prefix + 'How confident are you in your answers?', 'Not at all confident', 'Very confident');
  if (isFirst) {
    form.addParagraphTextItem().setTitle(prefix + 'In one sentence, how do the two countries differ?');
  }
  return page;
}

function addScale(form, title, low, high) {
  return form.addScaleItem().setTitle(title).setBounds(1, 5).setLabels(low, high).setRequired(true);
}

function addTime(form, title) {
  return form.addTextItem()
    .setTitle(title)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThan(0).setHelpText('Please enter a number of seconds.').build())
    .setRequired(true);
}
