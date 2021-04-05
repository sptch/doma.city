 SELECT taxes_full_data.id,
    taxes_full_data.coord AS _coord,
    taxes_full_data.report_year,
    COALESCE(sum(taxes_full_data.current_land_value) / taxes_area.area, 0::double precision) AS land_value,
    COALESCE(sum(taxes_full_data.current_improvement_value) / taxes_area.area, 0::double precision) AS improvement_value,
    COALESCE(sum(taxes_full_data.tax_levy) / taxes_area.area, 0::double precision) AS tax_levy,
    mode() WITHIN GROUP (ORDER BY taxes_full_data.year_built) AS year_built,
    mode() WITHIN GROUP (ORDER BY taxes_full_data.big_improvement_year) AS big_improvement_year,
    mode() WITHIN GROUP (ORDER BY taxes_full_data.zone_category) AS zone_category,
    mode() WITHIN GROUP (ORDER BY taxes_full_data.legal_type) AS legal_type
   FROM development.taxes_full_data,
    ( SELECT st_area("property_tax_report_-_parcels".geom::geography) AS area,
            "property_tax_report_-_parcels".id
           FROM "property_tax_report_-_parcels") taxes_area
  WHERE taxes_full_data.id = taxes_area.id
  GROUP BY taxes_full_data.id, taxes_full_data.coord, taxes_full_data.report_year, taxes_area.area;