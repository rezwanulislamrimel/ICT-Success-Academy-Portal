export default function About() {
  const cards = [
    ['চ্যাপ্টার ধরে ক্লাস', 'সিলেবাসের ক্রম মেনে পাঠ, যাতে কিছু বাদ না পড়ে।'],
    ['হাতে-কলমে প্র্যাকটিস', 'সংখ্যা পদ্ধতি, HTML, প্রোগ্রামিং আর ডেটাবেজের অংশ নিজে করে শেখা।'],
    ['পরীক্ষার প্রস্তুতি', 'MCQ, সৃজনশীল ও ব্যবহারিক — তিন ধরনের প্রশ্নেরই মডেল টেস্ট।'],
  ];
  return (
    <div className="wrap">
      <section>
        <div className="sec-head"><h2>কীভাবে পড়ানো হয়</h2></div>
        <div className="grid3">
          {cards.map(([t, p]) => <div className="card" key={t}><h3>{t}</h3><p>{p}</p></div>)}
        </div>
      </section>
    </div>
  );
}
