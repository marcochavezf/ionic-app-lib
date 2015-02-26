var start = require('../lib/start'),
    Q = require('q'),
    events = require('../lib/events');

// events.on('log', console.log)


// Things to test 
// Does it allow invalid vars? 
// What if a path doesnt exist?
// Invalid ID?
var dummyPath = '/Users/Test/Development/Ionic',
    dummyPackageName = 'com.ionic.app', 
    dummyAppName = 'Ionic App',
    appSetup;

var dummyOptions = {
  targetPath: dummyPath,
  template: 'sidemenu',
  packageName: dummyPackageName,
  appName: dummyAppName,
  isCordovaProject: true,
  setupSass: true
}

describe('Start', function() {

  it('should have start app defined', function() {
    expect(start.startApp).toBeDefined();
  })

  it('should have methods defined', function(){
    var methods = ['startApp', 'fetchWrapper', 'fetchSeed', 'loadAppSetup', 'fetchCreatorApp', 
      'fetchCodepen', 'convertTemplates', 'fetchLocalStarter', 'fetchIonicStarter', 
      'fetchGithubStarter', 'initCordova', 'updateConfigXml', 'setupSass', 'updateLibFiles', 'finalize'];
    methods.forEach(function(method) {
      expect(start[method]).toBeDefined();
    })
  })

  it('should have fetchWrapper defined', function() {
    expect(start.fetchWrapper).toBeDefined();
  })

  it('should have startApp defined', function() {
    expect(start.startApp).toBeDefined();
  })

  describe('#startApp', function(done) {
    beforeEach(function() {
      dummyOptions = {
        targetPath: dummyPath,
        template: 'sidemenu',
        packageName: dummyPackageName,
        appName: dummyAppName,
        isCordovaProject: true,
        setupSass: true
      }

      appSetup = {
        "plugins": [
          "org.apache.cordova.device",
          "org.apache.cordova.console",
          "com.ionic.keyboard"
        ],
        "sass": false
      }

      spyOn(start, 'loadAppSetup').andReturn(Q(appSetup))

      var startAppFunctions = ['fetchWrapper', 'fetchSeed', 'initCordova', 'setupSass', 'finalize'];
      startAppFunctions.forEach(function(func) {
        spyOn(start, func).andReturn(Q());
      })
    })

    it('should fail if no options are passed', function() {
      expect(function() {
        start.startApp()
      }).toThrow('You cannot start an app without options')
    })

    it('should fail if an invalid path is passed', function() {
      expect(function() {
        start.startApp({targetPath: '.'})
      }).toThrow('Invalid target path, you may not specify \'.\' as an app name')
    })

    it('should call fetchWrapper with proper variables', function(done) {
      start.startApp(dummyOptions)
      expect(start.fetchWrapper).toHaveBeenCalledWith(dummyOptions);
      done()
    })

    it('should call fetchSeed after calling fetchWrapper', function(done) {
      Q()
      .then(function(data) {
        return start.startApp(dummyOptions)
      })
      .then(function(data) {
        dummyOptions.appSetup = appSetup;
        expect(start.fetchSeed).toHaveBeenCalledWith(dummyOptions);
      })
      .catch(function(data) {
        expect('this').toBe('not this');
      })
      .fin(done);
    })

    it('should call initCordova with appSetup returned', function(done) {
      Q()
      .then(function() {
        return start.startApp(dummyOptions);
      })
      .then(function(data){

      })
      .catch(function(data) {
        expect('this').toBe('not this');
      })
      .fin(done);
    })
  })

  describe('#fetchSeed', function() {
    it('should call fetchIonicStart for an Ionic template type', function(done) {
      spyOn(start, 'fetchIonicStarter').andReturn(Q());

      Q()
      .then(function() {
        return start.fetchSeed(dummyOptions)
      })
      .then(function() {
        expect(start.fetchIonicStarter).toHaveBeenCalledWith(dummyOptions);
      })
      .catch(function(data) {
        expect('this').toBe('not this' + data);
      })
      .fin(done)
    })

    it('should call fetchCodepen when codepen URL is passed', function(done) {
      var codepenUrl = 'http://codepen.io/mhartington/pen/eomzw';
      spyOn(start, 'fetchCodepen').andReturn(Q());
      dummyOptions.template = codepenUrl;

      Q()
      .then(function(){
        return start.fetchSeed(dummyOptions);
      })
      .then(function() {
        expect(start.fetchCodepen).toHaveBeenCalledWith(dummyOptions)
      })
      .catch(function(err) {
        expect('this').toBe('not this'+ err);
      })
      .fin(done)
    })

    it('should call fetchCreatorApp when a creator url is passed', function(done) {
      var creatorUrl = 'http://app.ionic.io/creator:5010';
      spyOn(start, 'fetchCreatorApp').andReturn();
      dummyOptions.template = creatorUrl;

      Q()
      .then(function(){
        return start.fetchSeed(dummyOptions);
      })
      .then(function() {
        expect(start.fetchCreatorApp).toHaveBeenCalledWith(dummyOptions)
      })
      .catch(function(err) {
        expect('this').toBe('not this'+ err);
      })
      .fin(done)
    })

    it('should call fetchGithubStarter when a github url is passed', function(done) {
      var githubUrl = 'http://github.com/driftyco/ionic-unit-test-starter';
      spyOn(start, 'fetchGithubStarter').andReturn();
      dummyOptions.template = githubUrl;

      Q()
      .then(function(){
        return start.fetchSeed(dummyOptions);
      })
      .then(function() {
        expect(start.fetchGithubStarter).toHaveBeenCalledWith(dummyOptions, githubUrl)
      })
      .catch(function(err) {
        expect('this').toBe('not this'+ err);
      })
      .fin(done)
    })

    it('should call fetchLocalStarter when a local path is passed', function(done) {
      var localPath = '/Users/Testing/Dev/local-starter';
      spyOn(start, 'fetchLocalStarter').andReturn();
      dummyOptions.template = localPath;

      Q()
      .then(function(){
        return start.fetchSeed(dummyOptions);
      })
      .then(function() {
        expect(start.fetchLocalStarter).toHaveBeenCalledWith(dummyOptions)
      })
      .catch(function(err) {
        expect('this').toBe('not this'+ err);
      })
      .fin(done)
    })

  })

  // describe('#initCordova', function() {
  //   it('')
  // })

})
