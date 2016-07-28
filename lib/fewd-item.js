/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

/** Base class for the FEWD Toolkit. */
class FewdItem {
  /**
   * creates an instance of the FEWD toolkit
   * @param {object} - the configuration JSON for FEWD toolkit
   */
  constructor(name, handler, itemData, config) {
    this.parent = null;
    this.name = name;
    if(handler)
      this.handler = this.loadHandler(handler);
      this.items = this.loadItems(itemData);
    this.config = config;
    this.logger = console;
  }

  /**
   * finds a property on the configuration object passed
   * @param {object} configObj - the configuration object to search
   * @param {string} prop - the key to search for
   * @returns value of a property in the configObj
   */
  getConfigProperty(configObj, prop) {
    if(typeof prop === 'string') {
      if(configObj.hasOwnProperty(prop)) {
        return configObj[prop];
      } else {
        this.logger.info("No configuration key found for `" + prop + "`.");
      }
    } else {
      this.logger.error("Error: invalid property when getting config.");
    }
    return false;
  }

  /**
   * gets a configuration property based on a variable number of arguments
   * @param {Array} arguments - arguments are a list of strings, in order,
   *  to retrieve from the configuration object.
   * @returns the value of the configuration item specified, or false if the
   *  configurtion was not found.
   */
  getConfig() {
    var args = Array.from(arguments);
    var config = this.config;
    for(var i = 0; i < args.length; i++) {
      if(typeof config === 'object') {
        config = this.getConfigProperty(config, args[i]);
      }
    }
    return config;
  }

  /**
   * loads an npm module using require
   * @param {string} moduleName - the module name, or the path to load using
   *  require.
   * @returns the module that was loaded, or false if there is an error.
   */
  loadHandler() {
    let failError = false;
    let mod = false;
    try {
      mod = require(this.handler);
    } catch (_error) {
      failError = _error;
    } finally {
      if(failError) {
        this.log("Error loading '" + this.handler + "'.", failError);
        return false;
      }
      return mod;
    }
  }

  /** Load the items from the data */
  loadItems(itemData) {
    if(this.handler) {
      itemData.forEach( (item) => {
        this.addItem(
          new this.handler(item.name, item.handler, item.items, item.config)
        );
      });
    }
  }

  /**
   * Get the parent
   */
  getParent() {}

  /**
   * set the parent
   */
  setParent(parent) {
    this.parent = parent;
  }

  /**
   * Add a child item
   */
  addItem( FewdItem ) {
    FewdItem.setParent(this);
    this.items.push(FewdItem);
  }

}

module.exports = FewdItem;