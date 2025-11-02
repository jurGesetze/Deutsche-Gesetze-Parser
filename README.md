Ein **Parser für Deutsche Gesetze** auf Grundlage der Rechtsinformationen des Bundes [gesetze-im-internet.de](http://www.gesetze-im-internet.de/). Für eine maschinelle Weiterverarbeitung (z.B. Datenbanken, Frontend, Synopsen, spezifische Abfragen etc.), sind **einheitliche Strukturen und zeitgemäße Dateiformate** unerlässlich. 
Durch JurGesetze werden aus den vom `Bundesministerium der Justiz` bereitgestellten 
`.xml-Dateien` einheitliche, übersichtliche und leicht verständliche maschinenlesbare `Objekte`/`Dateien`. 

## Was ist jurGesetze?

- **Open Data API**: Schnittstelle um einzelne Paragraphen und ganze Gesetzesbücher abzurufen
- **Parser & Scraper**: Parsed alle Deutschen Gesetze des `BMJ` in `.json` bzw. als Gesetzes-`Objekte`

## Nutzung

Es können kleine stilistische (_Kursiv_, **Fett** etc.) Veränderungen in den Paragraphen einfach hervorgehoben werden, aber auch 
komplexe Strukturen wie Tabelle, Listen oder ähnliches werden dargestellt.

Grundsätzlich wird zunächst zwischen `Content`, `Directory` (Inhaltsverzeichnis) und `Meta` (wesentliche Informationen) unterschieden. Im `Content` sind insbesondere die Gesetzesnormen zu finden. Es wird dabei zwischen verschiedenen sog. `metaTypes` unterschieden. Es gibt einfache Normen (`NORM`), weggefallene Normen (`WEGGEFALLEN_NORM`), Eingangsbemerkungen (`ENTRY_PHRASE`), Anhänge (`ADDITIVE`), Schlussformeln (`COMPLIMENTARY`) und `OTHER`. In den jeweiligen Normen wird dann streng zwischen Text, Tabellen, Listen etc. unterschieden. 

bsp. § 433 BGB als `NORM:`

        {
            "title": "Vertragstypische Pflichten beim Kaufvertrag",
            "enbez": "§ 433",
            "metaType": "NORM",
            "normContent": [
                [
                    {
                        "type": "text",
                        "content": "(1) Durch den Kaufvertrag wird der Verkäufer einer Sache verpflichtet, dem Käufer die Sache zu übergeben und das Eigentum an der Sache zu verschaffen. Der Verkäufer hat dem Käufer die Sache frei von Sach- und Rechtsmängeln zu verschaffen.",
                        "bold": false,
                        "italic": false,
                        "underline": false
                    }
                ],
                [
                    {
                        "type": "text",
                        "content": "(2) Der Käufer ist verpflichtet, dem Verkäufer den vereinbarten Kaufpreis zu zahlen und die gekaufte Sache abzunehmen.",
                        "bold": false,
                        "italic": false,
                        "underline": false
                    }
                ]
            ],
            "footnotes": {
                "contentFootnote": null,
                "paragraphFootnote": null
            }
        }
        
`Strukturen:`

        {
            "id": 30030030,
            "name": "Titel 3",
            "title": "Erwerb und Verlust des Eigentums an beweglichen Sachen",
            "metaType": "STRUCTURE"
        }

In `Meta` werden alle wesentlichen Informationen über das Gesetzesbuch gesammelt dargestellt. 
`Meta-Objekt` des Bürgerlichen Gesetzbuches:

    "meta": {
        "jurabk": "BGB",
        "amtabk": "BGB",
        "langue": "Bürgerliches Gesetzbuch",
        "copy": "1896-08-18",
        "source": "RGBl 1896, 195",
        "standangabe": [
            {
                "type": "Neuf",
                "content": "Neugefasst durch Bek. v. 2.1.2002 I 42, 2909; 2003, 738;"
            },
            {
                "type": "Stand",
                "content": "zuletzt geändert durch Art. 2 G v. 21.12.2021 I 5252"
            },
            {
                "type": "Hinweis",
                "content": "Änderung durch Art. 5 G v. 24.6.2022 I 959 (Nr. 22) textlich nachgewiesen, dokumentarisch noch nicht abschließend bearbeitet"
            },
            {
                "type": "Hinweis",
                "content": "Änderung durch Art. 4 G v. 15.7.2022 I 1146 (Nr. 26) textlich nachgewiesen, dokumentarisch noch nicht abschließend bearbeitet"
            },
            {
                "type": "Sonst",
                "content": "mittelbare Änderung durch Art. 15 G v. 24.6.2022 I 959 (Nr. 22) ist berücksichtigt"
            }
        ],
        "metaType": "META",
        "footnotes": {
            "contentFootnote": null,
            "paragraphFootnote": [
                "",
                "(+++ Textnachweis Geltung ab: 1.1.1980 +++)",
                "(+++ Maßgaben aufgrund EinigVtr vgl. BGB Anhang EV; ",
                "     nicht mehr anzuwenden +++)",
                "(+++ Zur Anwendung im Beitrittsgebiet vgl. BGBEG Sechster Teil",
                "     (Art. 230 bis Art. 235) +++)",
                "(+++ Zur Anwendung d. § 1906 Abs. 3 ",
                "     vgl. BVerfGE vom 26.7.2016",
                "     - 1 BvL 8/15 - +++)",
                "(+++ Zur Anwendung d. § 311b Abs. 2 ",
                "     vgl. § 184 Satz 2 KAGB +++)",
                "(+++ Zur Anwendung d. §§ 271, 286, 288, 308 u. 310 ",
                "     vgl. Art. 229 § 34 BGBEG +++)",
                "(+++ Zur Nichtanwendung d. §§ 313, 314, 489, 490, 723 bis 725, 727, 728 ",
                "     vgl. § 10 Abs. 5 KredWG +++)",
                "(+++ Zur Nichtanwendung d. §§ 556d, 556e ",
                "     vgl. § 556f u. Art. 229 § 35 BGBEG +++)"
                [...gekürzt]
               
            ]
        },
        "toc": null
    }
    

## Wie starten?

Wenn Sie bereits Node.JS installiert haben, können Sie 

```
npx ts-node index.tsx
```
oder in `./scraper`
```
npx ts-node Scraper.ts
```

ausführen, um zu starten. Alternativ können Sie mit `npx ts-node Scraper.ts` in `./scraper` alle aktuellen Gesetze im `.xml-Format` herunterladen 
und anschließend mit `npx ts-node index.tsx` einzeln parsen. 
