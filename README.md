<img src="https://jurgesetze.de/static/media/logoJurGesetze.24ef74a288abbbd3b45a.png" width="540">

[![Discord Shield](https://img.shields.io/discord/1042366481003991060?color=000000&label=Discord&logo=fdgssdf)](https://discord.gg/rg4EeebJ)
<a href="https://twitter.com/jurgesetze"><img src="https://img.shields.io/twitter/follow/jurgesetze?label=Twitter&color=black" alt="Twitter"></a>

JurGesetze ist ein **Parser und eine API für Deutsche Gesetze** auf Grundlage der Rechtsinformationen des Bundes [gesetze-im-internet.de](http://www.gesetze-im-internet.de/). Für eine maschinelle Weiterverarbeitung (z.B. Datenbanken, Frontend, Synopsen, spezifische Abfragen etc.), sind **einheitliche Strukturen und zeitgemäße Dateiformate** unerlässlich. 

Durch JurGesetze werden aus den vom `Bundesministerium der Justiz` bereitgestellten 
`.xml-Dateien` einheitliche, übersichtliche und leicht verständliche maschinenlesbare `Objekte`/`Dateien`. Ferner bietet Ihnen jurGesetze auch eine **moderne Benutzeroberfläche zum Abrufen der aktuellen Gesetze im Internet.** 

## Was ist jurGesetze?

- **Open Data API**: Schnittstelle um einzelne Paragraphen und ganze Gesetzesbücher im JSON Format abzurufen
- **Parser & Scraper**: Parsed alle Deutschen Gesetze des `BMJ` in `.json` oder simple `Objekte`
- **Benutzeroberfläche**: Modernes UI Design und hilfreiche Funktionen, um effizient zu arbeiten

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

## Beispiele

Es können kleine stilistische (_Kursiv_, **Fett** etc.) Veränderungen in den Paragraphen einfach hervorgehoben werden, aber auch 
komplexe Strukturen wie Tabelle, Listen oder ähnliches.

bsp. § 433 BGB als `Objekt:

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
    
Strukturen:

        {
            "id": 30030030,
            "name": "Titel 3",
            "title": "Erwerb und Verlust des Eigentums an beweglichen Sachen",
            "metaType": "STRUCTURE"
        }
    
## Nutzung

:warning: Die API ist noch nicht online.

## Stand

Aktuell enthalten sind alle Bundesgesetze und -verordnungen in ihrer aktuellen Fassung. Die Daten werden im Hintergrund regelmäßig aktualisiert und in der Datenbank verarbeitet.
