import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB | TenderSniper",
  description: "Allgemeine Geschäftsbedingungen von TenderSniper",
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          {/* § 1 Geltungsbereich */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 1 Geltungsbereich
            </h2>
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend &quot;AGB&quot;)
              gelten für alle Verträge zwischen
            </p>
            <p className="mt-2">
              Hassan Mahra
              <br />
              Alte Hellersdorfer Straße 108G
              <br />
              12629 Berlin
              <br />
              (nachfolgend &quot;Anbieter&quot;)
            </p>
            <p className="mt-4">
              und dem Kunden (nachfolgend &quot;Kunde&quot;) über die Nutzung der Plattform
              &quot;TenderSniper&quot; (nachfolgend &quot;Dienst&quot;).
            </p>
            <p className="mt-4">
              (2) Der Dienst richtet sich ausschließlich an Unternehmer im Sinne
              von § 14 BGB. Die Nutzung durch Verbraucher ist ausgeschlossen.
            </p>
            <p className="mt-4">
              (3) Abweichende, entgegenstehende oder ergänzende Allgemeine
              Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil,
              es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich
              schriftlich zu.
            </p>
          </section>

          {/* § 2 Vertragsgegenstand */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 2 Vertragsgegenstand
            </h2>
            <p>
              (1) Der Anbieter stellt dem Kunden über die Plattform TenderSniper
              eine Software-as-a-Service (SaaS) Lösung zur Verfügung, die:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Öffentliche Ausschreibungen von Vergabeplattformen (z.B. bund.de)
                automatisiert erfasst
              </li>
              <li>
                Diese mittels künstlicher Intelligenz analysiert und
                zusammenfasst
              </li>
              <li>
                Passende Ausschreibungen basierend auf dem Nutzerprofil
                identifiziert
              </li>
              <li>
                Den Kunden per E-Mail oder andere Kanäle über relevante
                Ausschreibungen informiert
              </li>
            </ul>
            <p className="mt-4">
              (2) Der Anbieter schuldet keine bestimmte Anzahl an gefundenen
              Ausschreibungen oder den Erfolg bei der Auftragsvergabe.
            </p>
            <p className="mt-4">
              (3) Die bereitgestellten Informationen dienen lediglich der
              Unterstützung. Die Verantwortung für die Prüfung der
              Originalausschreibung und die Entscheidung zur Bewerbung liegt
              ausschließlich beim Kunden.
            </p>
          </section>

          {/* § 3 Vertragsschluss */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 3 Vertragsschluss
            </h2>
            <p>
              (1) Der Vertrag kommt durch die Registrierung des Kunden auf der
              Plattform und die Bestätigung der Registrierung durch den Anbieter
              zustande.
            </p>
            <p className="mt-4">
              (2) Mit der Registrierung bestätigt der Kunde, dass er Unternehmer
              ist und diese AGB sowie die Datenschutzerklärung gelesen und
              akzeptiert hat.
            </p>
            <p className="mt-4">
              (3) Der Anbieter behält sich vor, Registrierungen ohne Angabe von
              Gründen abzulehnen.
            </p>
          </section>

          {/* § 4 Preise und Zahlung */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 4 Preise und Zahlungsbedingungen
            </h2>
            <p>
              (1) Die aktuell gültigen Preise ergeben sich aus der Preisliste auf
              der Website des Anbieters. Alle Preise verstehen sich zuzüglich der
              gesetzlichen Umsatzsteuer.
            </p>
            <p className="mt-4">
              (2) Die Zahlung erfolgt im Voraus für den jeweiligen
              Abrechnungszeitraum (monatlich oder jährlich, je nach gewähltem
              Tarif).
            </p>
            <p className="mt-4">
              (3) Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zum
              Dienst zu sperren, bis die ausstehenden Beträge beglichen sind.
            </p>
            <p className="mt-4">
              (4) Der Anbieter behält sich Preisanpassungen vor. Diese werden dem
              Kunden mindestens 30 Tage vor Inkrafttreten mitgeteilt. Der Kunde
              hat in diesem Fall ein Sonderkündigungsrecht.
            </p>
          </section>

          {/* § 5 Laufzeit und Kündigung */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 5 Laufzeit und Kündigung
            </h2>
            <p>
              (1) Der Vertrag wird auf unbestimmte Zeit geschlossen, sofern nicht
              ausdrücklich eine feste Laufzeit vereinbart wurde.
            </p>
            <p className="mt-4">
              (2) Bei monatlicher Abrechnung kann der Vertrag von beiden Seiten
              mit einer Frist von 14 Tagen zum Ende des Abrechnungszeitraums
              gekündigt werden.
            </p>
            <p className="mt-4">
              (3) Bei jährlicher Abrechnung beträgt die Kündigungsfrist 30 Tage
              zum Ende des Vertragsjahres.
            </p>
            <p className="mt-4">
              (4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund
              bleibt unberührt.
            </p>
            <p className="mt-4">
              (5) Die Kündigung kann per E-Mail an hassanmahra123@gmail.com oder
              über die Kontoeinstellungen erfolgen.
            </p>
          </section>

          {/* § 6 Pflichten des Kunden */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 6 Pflichten des Kunden
            </h2>
            <p>(1) Der Kunde verpflichtet sich:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nur wahrheitsgemäße Angaben bei der Registrierung zu machen</li>
              <li>Seine Zugangsdaten geheim zu halten</li>
              <li>Den Dienst nicht missbräuchlich zu nutzen</li>
              <li>Keine automatisierten Zugriffe ohne Genehmigung durchzuführen</li>
            </ul>
            <p className="mt-4">
              (2) Der Kunde stellt den Anbieter von allen Ansprüchen Dritter
              frei, die aufgrund einer schuldhaften Pflichtverletzung des Kunden
              entstehen.
            </p>
          </section>

          {/* § 7 Haftungsbeschränkung */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 7 Haftungsbeschränkung
            </h2>
            <p>
              (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung
              des Lebens, des Körpers oder der Gesundheit sowie für vorsätzlich
              oder grob fahrlässig verursachte Schäden.
            </p>
            <p className="mt-4">
              (2) Für leicht fahrlässig verursachte Schäden haftet der Anbieter
              nur bei Verletzung wesentlicher Vertragspflichten
              (Kardinalpflichten). Die Haftung ist in diesem Fall auf den
              vorhersehbaren, vertragstypischen Schaden begrenzt.
            </p>
            <p className="mt-4">
              (3) Der Anbieter haftet nicht für die Richtigkeit, Vollständigkeit
              und Aktualität der von Dritten (z.B. bund.de) bezogenen Daten.
            </p>
            <p className="mt-4">
              (4) Der Anbieter übernimmt keine Haftung für den wirtschaftlichen
              Erfolg des Kunden bei Bewerbungen auf Ausschreibungen.
            </p>
            <p className="mt-4">
              (5) Die Haftungsbeschränkungen gelten auch zugunsten der
              Erfüllungsgehilfen des Anbieters.
            </p>
          </section>

          {/* § 8 Verfügbarkeit */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 8 Verfügbarkeit
            </h2>
            <p>
              (1) Der Anbieter bemüht sich um eine Verfügbarkeit des Dienstes von
              99% im Jahresmittel. Hiervon ausgenommen sind Zeiten, in denen der
              Server aufgrund von technischen oder sonstigen Problemen, die nicht
              im Einflussbereich des Anbieters liegen, nicht erreichbar ist.
            </p>
            <p className="mt-4">
              (2) Wartungsarbeiten werden nach Möglichkeit vorab angekündigt und
              außerhalb der üblichen Geschäftszeiten durchgeführt.
            </p>
          </section>

          {/* § 9 Schlussbestimmungen */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              § 9 Schlussbestimmungen
            </h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter
              Ausschluss des UN-Kaufrechts.
            </p>
            <p className="mt-4">
              (2) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist
              Berlin, sofern der Kunde Kaufmann ist.
            </p>
            <p className="mt-4">
              (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
              werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
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
