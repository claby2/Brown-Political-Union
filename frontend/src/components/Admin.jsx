import { useState, useEffect } from "react";
import { useFirebase } from "../firebase";
import ModifiableEventCard from "./Modifiable/ModifiableEventCard";
import ModifiablePartiesCard from "./Modifiable/ModifiablePartiesCard";
import ModifiableLeadCard from "./Modifiable/ModifiableLeadCard"
import React from 'react';
import "../App.css"

const Dashboard = ({ firebase, signOut }) => {
  const [events, setEvents] = useState([]);
  const [parties, setParties] = useState([]);
  const [leader, setLeaders] = useState([]);
  useEffect(() => {
    async function fetch() {
      setEvents((await firebase.getAllEventDocs()).sort());
      setParties((await firebase.getAllGenDocs("parties")).sort());
      setLeaders((await firebase.getAllGenDocs("leadership")).sort());
    }
    fetch();
  }, [firebase]);

  return (
    <section>
      <h3 class="font-bold text-3xl">Admin Dashboard</h3>
      <div class="grid pb-16 mx-auto px-8 grid-cols-1 gap-8">
        {events.map((event, i) => {
          const data = event.data();
          return (
            <div class="my-2" key={i}>
              <ModifiableEventCard
                firebase={firebase}
                id={event.id}
                image={data.image}
                virtual={data.virtual}
                title={data.title}
                description={data.description}
                where={data.where}
                when={data.when.toDate()}
              />
            </div>
          );
        })}
      </div>
      <div className="grid pb-16 mx-auto px-8 grid-cols-1 gap-8">
        {parties.map((part, i) => {
          const data = part.data();
          return (
              <div className="my-2" key={i}>
                <ModifiablePartiesCard
                    firebase={firebase}
                    id={part.id}
                    name={data.name}
                    image={data.image}
                    blurbs={data.blurbs}
                />
              </div>
          );
        })}
      </div>
      <div className="grid pb-16 mx-auto px-8 grid-cols-1 gap-8">
        {leader.map((part, i) => {
          const data = part.data();
          return (
              <div className="my-2" key={i}>
                <ModifiableLeadCard
                    firebase={firebase}
                    id={part.id}
                    name={data.name}
                    image={data.image}
                    position={data.position}
                    blurbs={data.blurbs}
                />
              </div>
          );
        })}
      </div>
      <button
        class="font-bold border-2 p-2 rounded-md border-slate-400 bg-gray-600 text-white hover:bg-[#650202]"
        onClick={signOut}
      >
        Sign out
      </button>
    </section>
  );
};

const LogInSection = ({ signIn, setEmail, setPassword }) => {
  const handleInputChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    if (name === "email") {
      setEmail(event.target.value);
    } else if (name === "password") {
      setPassword(event.target.value);
    }
  };

  return (
    <section>
      <h3 class="font-bold text-3xl">Admin Login</h3>
      <div class="flex flex-col mb-4">
        <input
        type="text"
        name="email"
        class="border-2 my-4 p-2 border-slate-400"
        placeholder="Email address"
        onChange={handleInputChange}
        />
        <input
        type="password"
        name="password"
        class="border-2 p-2 border-slate-400"
        placeholder="Password"
        onChange={handleInputChange}
        />
      </div>
      <button
        class="font-bold border-2 p-2 rounded-md border-slate-400 bg-gray-600 text-white hover:bg-[#650202]"
        onClick={signIn}
      >
        Sign in
      </button>
      <div className="h-32">

      </div>
    </section>
  );
};

const Admin = () => {
  const firebase = useFirebase();

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    await firebase.signIn(email, password);
  };

  const signOut = async () => {
    await firebase.auth.signOut();
    setLoggedIn(false);
  };

  useEffect(() => {
    firebase.auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      setLoggedIn(true);
    });
  }, [firebase]);

  return (
    <div>
      <div class="mt-40 mx-auto max-w-screen-lg px-8">
        {loggedIn ? (
          <Dashboard firebase={firebase} signOut={signOut} />
        ) : (
          <LogInSection
            signIn={signIn}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
