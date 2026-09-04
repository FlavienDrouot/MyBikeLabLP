// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../ContactForm';

const translations = {
  'contact.eyebrow': 'Contact',
  'contact.namePlaceholder': 'Name',
  'contact.emailPlaceholder': 'Email',
  'contact.companyLabel': 'Company',
  'contact.companyPlaceholder': 'Company (optional)',
  'contact.messagePlaceholder': 'Message',
  'contact.submit': 'Send message',
  'contact.errors.nameRequired': 'Name is required',
  'contact.errors.emailRequired': 'Email is required',
  'contact.errors.messageRequired': 'Message is required',
  'contact.success.body': 'We will get back to you at {{email}} shortly.',
  'contact.successFallbackName': 'there',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (key === 'contact.success.title') return `Thanks, ${options?.name}.`;
      return translations[key] ?? key;
    },
  }),
}));

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

    expect(container.textContent).toContain('Name is required');
    expect(container.textContent).toContain('Email is required');
    expect(container.textContent).toContain('Message is required');
    expect(container.querySelector('#name').getAttribute('aria-invalid')).toBe('true');
    expect(container.querySelector('#email').getAttribute('aria-invalid')).toBe('true');
    expect(container.querySelector('#message').getAttribute('aria-invalid')).toBe('true');
    expect(open).not.toHaveBeenCalled();
  });

  it('keeps the mailto submission and success state', () => {
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
    expect(container.querySelector('.contact-success')).not.toBeNull();
    expect(container.textContent).toContain('Thanks, Ada.');
  });
});
