/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const values = Object.values(JSON.parse(json));
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  getThrow() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  element(value) {
    const selectors = this.selectors || {};
    selectors.element = value;
    return { ...this, element: this.getThrow, selectors };
  },

  id(value) {
    const selectors = this.selectors || {};
    selectors.id = `#${value}`;
    return { ...this, id: this.getThrow, selectors };
  },

  class(value) {
    const selectors = this.selectors || { class: [] };
    const resultValue = `.${value}`;
    if (selectors.class) {
      selectors.class.push(resultValue);
    } else {
      selectors.class = [resultValue];
    }
    return { ...this, selectors };
  },

  attr(value) {
    const selectors = this.selectors || { attr: [] };
    const resultValue = `[${value}]`;
    if (selectors.attr) {
      selectors.attr.push(resultValue);
    } else {
      selectors.attr = [resultValue];
    }
    return { ...this, selectors };
  },

  pseudoClass(value) {
    const selectors = this.selectors || { pseudoClass: [] };
    const resultValue = `:${value}`;
    if (selectors.pseudoClass) {
      selectors.pseudoClass.push(resultValue);
    } else {
      selectors.pseudoClass = [resultValue];
    }
    return { ...this, selectors };
  },

  pseudoElement(value) {
    const selectors = this.selectors || {};
    selectors.pseudoElement = `::${value}`;
    return { ...this, pseudoElement: this.getThrow, selectors };
  },

  combine(selector1, combinator, selector2) {
    return { ...this, value: `${selector1.stringify()} ${combinator} ${selector2.stringify()}` };
  },
  stringify() {
    const {
      element = '', id = '', class: cl = [], attr = [], pseudoClass = [], pseudoElement = '',
    } = this.selectors;
    return element + id + cl.join('') + attr.join('') + pseudoClass.join('') + pseudoElement;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
