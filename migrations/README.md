
##  sequelize-cli
```
$  cnpm i -g sequelize-cli
```

## create migration file

```
$ sequelize migration:generate  --migrations-path ./ --name v1.0.0-add-field
```

## db:migration

```
$ sequelize db:migrate --migrations-path ./ --env ***
```