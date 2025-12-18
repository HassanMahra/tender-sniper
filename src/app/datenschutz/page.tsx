import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | TenderSniper",
  description: "Datenschutzerklärung von TenderSniper - Informationen zur Verarbeitung Ihrer Daten",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          {/* 1. Allgemeine Hinweise */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
              Datenschutz
            </h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mt-4">
              Wenn Sie diese Website benutzen, werden verschiedene
              personenbezogene Daten erhoben. Personenbezogene Daten sind Daten,
              mit denen Sie persönlich identifiziert werden können. Die
              vorliegende Datenschutzerklärung erläutert, welche Daten wir
              erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu
              welchem Zweck das geschieht.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
              Verantwortliche Stelle
            </h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:
            </p>
            <p className="mt-2">
              Hassan Mahra
              <br />
              Alte Hellersdorfer Straße 108G
              <br />
              12629 Berlin
              <br />
              <br />
              Telefon: 0176 72261372
              <br />
              E-Mail: hassanmahra123@gmail.com
            </p>
          </section>

          {/* 2. Datenerfassung */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Datenerfassung auf dieser Website
            </h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
              Cookies
            </h3>
            <p>
              Unsere Internetseiten verwenden so genannte "Cookies". Cookies sind
              kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden
              an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
              (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem
              Endgerät gespeichert.
            </p>
            <p className="mt-4">
              Wir verwenden technisch notwendige Cookies für die
              Benutzerauthentifizierung und Session-Verwaltung. Diese Cookies
              sind für den Betrieb der Website erforderlich und können in
              unseren Systemen nicht deaktiviert werden.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
              Server-Log-Dateien
            </h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mt-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
              nicht vorgenommen.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
              Registrierung auf dieser Website
            </h3>
            <p>
              Sie können sich auf dieser Website registrieren, um zusätzliche
              Funktionen auf der Seite zu nutzen. Die dazu eingegebenen Daten
              verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes
              oder Dienstes, für den Sie sich registriert haben.
            </p>
            <p className="mt-4">
              Die bei der Registrierung abgefragten Pflichtangaben müssen
              vollständig angegeben werden. Anderenfalls werden wir die
              Registrierung ablehnen.
            </p>
          </section>

          {/* 3. Hosting */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Hosting
            </h2>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet
              (Hoster). Die personenbezogenen Daten, die auf dieser Website
              erfasst werden, werden auf den Servern des Hosters gespeichert.
            </p>
            <p className="mt-4">
              Wir nutzen <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133,
              Walnut, CA 91789, USA) als Hosting-Anbieter. Vercel ist unter dem
              EU-US Data Privacy Framework zertifiziert und bietet damit eine
              Garantie für die Einhaltung des europäischen Datenschutzniveaus.
            </p>
          </section>

          {/* 4. Datenbank & Backend */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Datenbank und Backend-Dienste
            </h2>
            <p>
              Für die Datenspeicherung und Authentifizierung nutzen wir{" "}
              <strong>Supabase Inc.</strong> (970 Toa Payoh North #07-04,
              Singapore 318992). Supabase verarbeitet Ihre Daten in Rechenzentren
              innerhalb der Europäischen Union (Frankfurt, Deutschland).
            </p>
            <p className="mt-4">
              Folgende Daten werden bei Supabase gespeichert:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Verschlüsseltes Passwort</li>
              <li>Profilinformationen (Name, Firma)</li>
              <li>Sucheinstellungen</li>
              <li>Nutzungsdaten des Dienstes</li>
            </ul>
          </section>

          {/* 5. Ihre Rechte */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Ihre Rechte
            </h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Auskunft</strong> über Ihre bei uns gespeicherten
                personenbezogenen Daten zu erhalten (Art. 15 DSGVO)
              </li>
              <li>
                <strong>Berichtigung</strong> unrichtiger Daten zu verlangen
                (Art. 16 DSGVO)
              </li>
              <li>
                <strong>Löschung</strong> Ihrer Daten zu verlangen (Art. 17
                DSGVO)
              </li>
              <li>
                <strong>Einschränkung der Verarbeitung</strong> zu verlangen
                (Art. 18 DSGVO)
              </li>
              <li>
                <strong>Datenübertragbarkeit</strong> zu verlangen (Art. 20
                DSGVO)
              </li>
              <li>
                <strong>Widerspruch</strong> gegen die Verarbeitung einzulegen
                (Art. 21 DSGVO)
              </li>
            </ul>
            <p className="mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
              hassanmahra123@gmail.com
            </p>
            <p className="mt-4">
              Sie haben außerdem das Recht, sich bei einer
              Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten durch uns zu beschweren.
            </p>
          </section>

          {/* 6. Änderungen */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              6. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit
              sie stets den aktuellen rechtlichen Anforderungen entspricht oder
              um Änderungen unserer Leistungen in der Datenschutzerklärung
              umzusetzen.
            </p>
            <p className="mt-4">
              <em>Stand: Dezember 2025</em>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

