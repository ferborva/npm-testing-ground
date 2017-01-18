import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('represent-connections', 'Integration | Component | represent connections', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{represent-connections}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#represent-connections}}
      template block text
    {{/represent-connections}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
