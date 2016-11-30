#!/bin/sh

export STARDOG_HOME=/home/mikel/UPV-EHU/Teaching/UM_Master_Bioinf/2015/LinkedData/LinkedDataServer/stardog-3.0-home
# export STARDOG_HOME=/home/mikel/LinkedDataServer/stardog-3.0-home

export PATH=/home/mikel/UPV-EHU/Teaching/UM_Master_Bioinf/2015/LinkedData/LinkedDataServer/stardog-3.0/bin:$PATH
# export PATH=/home/mikel/LinkedDataServer/stardog-3.0/bin:$PATH



# ATICA (Si no, crear online y subir todo online)

# stardog-admin server start --port 8180
# 
# stardog-admin --server snarl://localhost:8180 db create -n um
# 
# stardog data add snarl://localhost:8180/um data/data2.rdf data/data.rdf








# stardog-admin server stop

# stardog-admin db create -n um data/data.rdf

# stardog data add um data/data2.rdf data/data.rdf

# stardog-admin db create -n um
# stardog data add --named-graph http://um.es/ld um data/data.rdf data/data2.rdf




