library(readr)
library(stringr)
library(lubridate)
library(dplyr)
library(jsonlite)
library(purrr)

# načti letošní výsledky

vysledky <- read_csv("results.csv")

vysledky$date <- as_datetime(vysledky$tstamp)

vysledky_letos <- vysledky %>%
  filter(date>"2021-05-12") %>%
  filter(date<"2021-05-27")


vysledky_letos$clean <- str_extract_all(vysledky_letos$tip, "[a-z]{2}")

vysledky_letos$tips <- map(vysledky_letos$tip, fromJSON)

winners <- sapply(tips, function(x) {x[17,1]})

table <- as.data.frame(table(winners))
table$pct <- table$Freq/2387


# správné tipy

vysledky_letos %>%
  filter(sapply(clean, function(x) {x[[17]]=="ca"})) %>%
  filter(sapply(clean, function(x) {x[[14]]=="fi"})) %>%
  distinct()
  

# umístění Čechů

cesi <- lapply(vysledky_letos$clean, function(x) {str_detect(x, "cz")})

sum(sapply(cesi, function(x) {sum(x[13:14])}))

winners$clean

  sum(str_detect(vysledky_letos$tip, "se"))


tips <- map(vysledky_letos$tip, fromJSON)

winners <- sapply(tips, function(x) {x[17,1]})

table <- as.data.frame(table(winners))
table$pct <- table$Freq/2120


finals <- sapply(tips, function(x) {x[11,1] x[12,1]})

sum(str_detect("lv", vysledky_letos$tip))
