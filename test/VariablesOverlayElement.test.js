/* eslint-disable prefer-destructuring */
import { assert, html, fixture, nextFrame, oneEvent } from '@open-wc/testing';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator';
import '../variables-overlay.js';
import { resetSelection } from './ModelUtils.js';

/** @typedef {import('@advanced-rest-client/arc-types').Variable.ARCVariable} ARCVariable */
/** @typedef {import('@advanced-rest-client/arc-types').Variable.ARCEnvironment} ARCEnvironment */
/** @typedef {import('../index').VariablesOverlayElement} VariablesOverlayElement */

describe('VariablesOverlayElement', () => {
  const generator = new DataGenerator();

  /**
   * @returns {Promise<VariablesOverlayElement>}
   */
  async function basicFixture() {
    const elm = /** @type VariablesOverlayElement */ (await fixture(html`<variables-overlay></variables-overlay>`));
    if (!elm.environments) {
      await oneEvent(elm, 'ready');
    }
    return elm;
  }

  /**
   * @returns {Promise<VariablesOverlayElement>}
   */
  async function openedFixture() {
    const elm = /** @type VariablesOverlayElement */ (await fixture(html`<variables-overlay opened></variables-overlay>`));
    if (!elm.environments) {
      await oneEvent(elm, 'ready');
    }
    return elm;
  }

  before(async () => {
    await generator.insertVariablesAndEnvironments({
      defaultEnv: true,
      size: 5,
    });
    await generator.insertVariablesAndEnvironments({
      randomEnv: true,
      size: 5,
    });
  });

  after(async () => {
    await resetSelection();
    await generator.destroyVariablesData();
  });

  describe('view rendering', () => {
    let element = /** @type VariablesOverlayElement */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('renders intro message', () => {
      const node = element.shadowRoot.querySelector('.intro');
      assert.ok(node);
    });

    it('renders intro message', () => {
      const node = element.shadowRoot.querySelector('.intro');
      assert.ok(node);
    });

    it('renders environment variables', () => {
      const node = element.shadowRoot.querySelector('.environment-variables');
      assert.ok(node);
    });

    it('does not render system variables by default', () => {
      const node = element.shadowRoot.querySelector('.system-variables');
      assert.notOk(node);
    });

    it('renders system variables when enabled', async () => {
      element.systemVariablesEnabled = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.system-variables');
      assert.ok(node);
    });

    it('renders the footer', () => {
      const node = element.shadowRoot.querySelector('.overlay-footer');
      assert.ok(node);
    });

    it('renders the close button', () => {
      const node = element.shadowRoot.querySelector('.overlay-footer anypoint-button');
      assert.ok(node);
    });

    it('renders the system variables switch', () => {
      const node = element.shadowRoot.querySelector('.overlay-footer anypoint-switch');
      assert.ok(node);
    });
  });

  describe('closing the overlay', () => {
    let element = /** @type VariablesOverlayElement */ (null);
    beforeEach(async () => {
      element = await openedFixture();
    });

    it('closes the overlay from the button click', () => {
      const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.overlay-footer anypoint-button'));
      node.click();
      assert.isFalse(element.opened);
    });
  });

  describe('toggling system variables', () => {
    let element = /** @type VariablesOverlayElement */ (null);
    beforeEach(async () => {
      element = await openedFixture();
    });

    it('closes the overlay from the button click', () => {
      const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.overlay-footer anypoint-switch'));
      node.click();
      assert.isTrue(element.systemVariablesEnabled);
    });
  });
});
