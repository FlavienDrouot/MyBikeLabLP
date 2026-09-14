// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../ContactForm';

const setFieldValue = (element, value) => {
  const setter = Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value').set;
  setter.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('ContactForm', () => {
  let container;
  let root;
  let open;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    open = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    act(() => root.unmount());
    open.mockRestore();
    container.remove();
  });

  it('keeps the required-field validation visible in the Wave 5 form card', () => {
    act(() => root.render(createElement(ContactForm)));

    act(() => {
      container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    expect(container.textContent).toContain('Please enter your name.');
    expect(container.textContent).toContain('Please enter your email address.');
    expect(container.textContent).toContain('Please write your message.');
    expect(container.querySelector('#name').getAttribute('aria-invalid')).toBe('true');
    expect(container.querySelector('#email').getAttribute('aria-invalid')).toBe('true');
    expect(container.querySelector('#message').getAttribute('aria-invalid')).toBe('true');
    expect(open).not.toHaveBeenCalled();
  });

  it('prepares the mailto message and asks the visitor to send it', () => {
    act(() => root.render(createElement(ContactForm)));

    act(() => {
      setFieldValue(container.querySelector('#name'), 'Ada');
      setFieldValue(container.querySelector('#email'), 'ada@example.com');
      setFieldValue(container.querySelector('#company'), 'Example Co');
      setFieldValue(container.querySelector('#message'), 'Hello');
    });

    act(() => {
      container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    expect(open).toHaveBeenCalledWith(expect.stringContaining('mailto:contact.mybikelab@gmail.com'));
    expect(container.querySelector('[role=status]')).not.toBeNull();
    expect(container.textContent).toContain('One more step');
    expect(container.textContent).toContain('Send the email from your email app to get in touch with me.');
    expect(container.textContent).not.toContain('Ada');
  });
});
