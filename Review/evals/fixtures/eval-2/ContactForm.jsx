import { useState } from 'react';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
    setSubmitted(true);
    setPreview(`<p>Merci <strong>${name}</strong> ! Voici votre message :</p><blockquote>${message}</blockquote>`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre nom"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemple.com"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message"
          rows={5}
          className="w-full border p-2 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Envoyer
      </button>

      {submitted && (
        <div
          className="mt-4 p-4 bg-green-100 rounded"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      )}
    </form>
  );
}

export default ContactForm;
