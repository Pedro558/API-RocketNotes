const knex = require("../database/knex");

class NotesController {
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const user_id = req.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    const linkInsert = links.map((link) => {
      return {
        note_id,
        url: link,
      };
    });

    await knex("links").insert(linkInsert);

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knex("tags").insert(tagsInsert);

    return res.json();
  }

  async show(req, res) {
    const { id } = req.params;
    const note = await knex
      .select("id", "title", "description", "user_id")
      .from("notes")
      .where({ id })
      .first();

    const links = await knex.select("url").from("links").where({ note_id: id });

    const tags = await knex.select("name").from("tags").where({ note_id: id });

    // código rodrigo
    /*const note = await knex('notes').where({ id }).first()
    const tags = await knex('tags').where({
      note_id: id
    })
    const links = await knex('links').where({
      note_id: id
    }).orderBy('created_at')

    return res.json({
      ...note,
      tags,
      links

    })*/
    res.json({
      ...note,
      links,
      tags,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    res.json();
  }

  async index(req, res) {
    const { title, tags } = req.query;

    const user_id = req.user.id;

    let queryNotes = knex
      .select("notes.id", "notes.title", "notes.description", "notes.user_id")
      .from("notes")
      .where("notes.user_id", user_id);

    if (title && !tags) {
      queryNotes.whereLike("title", `%${title}%`);
    } else if (!title && tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());
      queryNotes
        .innerJoin("tags", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .whereIn("name", filterTags)
    } else if (title && tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());
      queryNotes
        .innerJoin("tags", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .whereIn("tags.name", filterTags)
        .whereLike("title", `%${title}%`)
    }

    const notes = await queryNotes;

    const userTags = await knex("tags").where({ user_id });

    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);
      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.json(notesWithTags);
  }
}

module.exports = NotesController;
